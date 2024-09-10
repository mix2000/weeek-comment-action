import * as core from "@actions/core";
import * as github from "@actions/github";
import {
  getActionInput,
  getErrorMessage,
  getTaskIdFromBranchName,
} from "./utils";
import { ActionInputs } from "./consts";
import puppeteer from "puppeteer";

const addComment = async (comment: string) => {
  const weeekDomain = getActionInput(ActionInputs.weeekDomain);
  const weeekProjectId = getActionInput(ActionInputs.weeekProjectId);
  const weeekLogin = getActionInput(ActionInputs.weeekLogin);
  const weeekPassword = getActionInput(ActionInputs.weeekPassword);

  const weeekTaskId = getTaskIdFromBranchName(github.context.ref);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXEC_PATH,
  });
  const page = await browser.newPage();

  const signInUrl = new URL("sign-in", weeekDomain);

  await page.goto(signInUrl.toString(), {
    waitUntil: "networkidle0",
    timeout: 10000,
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

  const authUrl = new URL("auth/sign-in", weeekDomain);

  page.waitForResponse(authUrl.toString()).then((res) => {
    if (res.ok()) {
      return true;
    } else {
      core.setFailed(
        `Не удалось войти в Weeek: ${getErrorMessage(res.statusText())}`,
      );
    }
  });

  const wsUrl = new URL("ws", weeekDomain);
  const projectUrl = new URL(weeekProjectId, wsUrl);
  const taskUrl = new URL(`m/task/${weeekTaskId}`, projectUrl);

  return new Promise<void>(async (resolve, reject) => {
    page
      .waitForFunction(() =>
        document.location.href.startsWith(wsUrl.toString()),
      )
      .then(async () => {
        try {
          await page.goto(taskUrl.toString(), { waitUntil: "networkidle0" });

          const inputPlaceholderSelector = ".empty__placeholder";
          const inputFieldSelector = ".input [contenteditable=true] p";
          const sendButtonSelector = "button.data__button-send";

          await page.waitForSelector(inputPlaceholderSelector);
          await page.click(inputPlaceholderSelector);

          await page.waitForSelector(inputFieldSelector);
          await page.type(inputFieldSelector, comment);

          await page.waitForSelector(sendButtonSelector);
          await page.click(sendButtonSelector);

          resolve();
        } catch (e) {
          core.info('error 1')
          reject(e);
        }
      });

    try {
      await page.type(loginSelector, weeekLogin);
      await page.type(passwordSelector, weeekPassword);
      await page.click(submitButtonSelector);
    } catch (e) {
      core.info('error 2')
      reject(e);
    }
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

    await addComment(finalComment);

    core.info("Комментарий успешно добавлен к задаче");
  } catch (error) {
    core.setFailed(`Ошибка: ${getErrorMessage(error)}`);
  }
};

run();
