import * as core from "@actions/core";
import * as github from "@actions/github";
import {
  getActionInput,
  getErrorMessage,
  getTaskIdFromBranchName,
} from "./utils";
import { ActionInputs } from "./consts";
import puppeteer from "puppeteer";
import joinUrl from "url-join";

const addComment = async (comment: string, weeekTaskId: string) => {
  return new Promise<void>(async (resolve) => {
    const weeekDomain = getActionInput(ActionInputs.weeekDomain);
    const weeekApiDomain = getActionInput(ActionInputs.weeekApiDomain);
    const weeekProjectId = getActionInput(ActionInputs.weeekProjectId);
    const weeekLogin = getActionInput(ActionInputs.weeekLogin);
    const weeekPassword = getActionInput(ActionInputs.weeekPassword);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXEC_PATH,
    });
    const page = await browser.newPage();

    page.setDefaultTimeout(10000);

    const scrollElementToBottom = async (selector: string) => {
      await page.evaluate((selector) => {
        const element = document.querySelector(selector);

        if (element) {
          element.scrollTo({
            top: element.scrollHeight,
            behavior: "instant",
          });
        }
      }, selector);
    };

    const setUrlSoftly = async (url: string) => {
      await page.evaluate((url) => {
        window.history.pushState({}, "", url);
        window.dispatchEvent(new Event("popstate"));
      }, url);
    };

    const wsUrl = joinUrl(weeekDomain, "ws");
    const projectUrl = joinUrl(wsUrl, weeekProjectId);
    const taskUrl = joinUrl(projectUrl, "m/task", weeekTaskId);

    const signInUrl = joinUrl(weeekDomain, "sign-in");

    await page.goto(signInUrl, {
      waitUntil: "networkidle2",
    });

    const loginSelector = "form input[type=email]";
    const passwordSelector = "form input[type=password]";
    const submitButtonSelector = "form button";

    await page.waitForSelector(loginSelector, {
      visible: true,
    });
    await page.waitForSelector(passwordSelector, {
      visible: true,
    });
    await page.waitForSelector(submitButtonSelector, {
      visible: true,
    });

    const authUrl = joinUrl(weeekApiDomain, "auth/login");

    await page.type(loginSelector, weeekLogin);
    await page.type(passwordSelector, weeekPassword);

    page.waitForResponse(authUrl).then((res) => {
      if (res.ok()) {
        core.info("Успешный вход в Weeek");
      } else {
        core.setFailed(
          `Не удалось войти в Weeek: ${getErrorMessage(res.statusText())}`,
        );

        return;
      }

      page
        .waitForResponse((res) => {
          return Boolean(
            res.url().match(/.*\/ws\/[a-zA-Z0-9]+\/tm\/calendar\/tasks/),
          );
        })
        .then(async () => {
          await setUrlSoftly(taskUrl);

          const taskWrapperSelector = ".task .task__wrapper";
          const inputPlaceholderSelector = ".empty__placeholder";
          const inputFieldSelector = ".input [contenteditable=true] p";
          const sendButtonSelector = "button.data__button-send";

          await page.waitForSelector(taskWrapperSelector);
          await scrollElementToBottom(taskWrapperSelector);

          await page.waitForSelector(inputPlaceholderSelector);
          await page.click(inputPlaceholderSelector);

          await page.waitForSelector(inputFieldSelector);
          await page.type(inputFieldSelector, comment);

          await page.waitForSelector(sendButtonSelector);
          await page.click(sendButtonSelector);

          await page.waitForResponse((res) => {
            return Boolean(
              res
                .url()
                .match(
                  /.*\/ws\/[a-zA-Z0-9]+\/tm\/tasks\/[a-zA-Z0-9]+\/comments/,
                ) &&
                res.status() > 200 &&
                res.status() < 300,
            );
          });

          page.on("response", async (res) => {
            const match = Boolean(
              res
                .url()
                .match(
                  /.*\/ws\/[a-zA-Z0-9]+\/tm\/tasks\/[a-zA-Z0-9]+\/comments/,
                ),
            );

            if (match) {
              await browser.close();

              resolve();
            }
          });
        });
    });

    await page.click(submitButtonSelector);
  });
};

const run = async () => {
  try {
    const branchName = getActionInput(ActionInputs.branchName);
    const comment = getActionInput(ActionInputs.comment);
    const userMappingJson = getActionInput(ActionInputs.userMapping);

    const userMapping: Record<string, string> = userMappingJson
      ? JSON.parse(userMappingJson)
      : {};

    const taskId = getTaskIdFromBranchName(branchName);

    if (!taskId) {
      core.setFailed(
        `Не удалось извлечь идентификатор задачи из ветки: ${branchName}`,
      );
      return;
    }

    const githubUsername = github.context.actor;
    const weeekUserId = userMapping[githubUsername];

    core.info(`Найден идентификатор задачи: ${taskId}`);

    const finalComment = weeekUserId ? `${weeekUserId}: ${comment}` : comment;

    await addComment(finalComment, taskId);

    core.info("Комментарий успешно добавлен к задаче");
  } catch (error) {
    core.info(`error: ${getErrorMessage(error)}`);

    core.setFailed(`Ошибка: ${getErrorMessage(error)}`);
  }
};

run();
