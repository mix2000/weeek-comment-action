import * as core from "@actions/core";
import * as github from "@actions/github";
import {
  getActionInput,
  getErrorMessage,
  getTaskIdFromBranchName,
} from "./utils";
import { ActionInputs } from "./consts";
import { scenarioAddComment } from "./scenario/add-comment";

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
      throw new Error(
        `Не удалось извлечь идентификатор задачи из ветки: ${branchName}`,
      );
    }

    const githubUsername = github.context.actor;
    const weeekUserId = userMapping[githubUsername];

    core.info(`Найден идентификатор задачи: ${taskId}`);

    const finalComment = weeekUserId ? `${weeekUserId}: ${comment}` : comment;

    await scenarioAddComment(finalComment, taskId);

    core.info("Комментарий успешно добавлен к задаче");
  } catch (error) {
    const errorString = `Ошибка: ${getErrorMessage(error)}`;

    core.info(errorString);
    core.setFailed(errorString);
  }
};

run();
