import { getActionInput } from "../utils";
import { ActionInputs } from "../consts";
import puppeteer from "puppeteer";
import { addComment, authorize, goToTask } from "../puppeteer-action";
import * as core from "@actions/core";

export const scenarioAddComment = async (comment, weeekTaskId) => {
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

  try {
    // Авторизация
    await authorize(
      page,
      weeekLogin,
      weeekPassword,
      weeekDomain,
      weeekApiDomain,
    );

    // Переход к задаче
    await goToTask(page, weeekDomain, weeekProjectId, weeekTaskId);

    // Добавление комментария
    await addComment(page, comment);
  } catch (error) {
    core.error(`Ошибка: ${error.message}`);
  } finally {
    await browser.close();
  }
};
