import * as core from "@actions/core";
import * as github from "@actions/github";
import {
  getErrorMessage,
  getTaskComment,
  getTaskIdFromBranchName,
} from "./utils";
import { ActionInputs } from "./consts";
import { WeeekAPI } from "./api";

interface UserMapping {
  [key: string]: string;
}

const run = async () => {
  try {
    const weeekApiKey = core.getInput(ActionInputs.weeekApiKey, {
      required: true,
    });
    const branchName = core.getInput(ActionInputs.branchName, {
      required: true,
    });
    const comment = core.getInput(ActionInputs.comment, { required: true });
    const userMappingJson = core.getInput(ActionInputs.userMapping);

    const WeeekApiInstance = new WeeekAPI(weeekApiKey);

    const userMapping: UserMapping = userMappingJson
      ? JSON.parse(userMappingJson)
      : {};

    const taskIdMatch = getTaskIdFromBranchName(branchName);

    if (!taskIdMatch) {
      core.setFailed(
        `Не удалось извлечь идентификатор задачи из ветки: ${branchName}`,
      );
      return;
    }

    const taskId = taskIdMatch[1];
    const githubUsername = github.context.actor;
    const weeekUserId = userMapping[githubUsername];

    core.info(`Найден идентификатор задачи: ${taskId}`);

    const finalComment = weeekUserId ? `${weeekUserId}: ${comment}` : comment;

    const taskInfo = await WeeekApiInstance.getTaskInfo(taskId);

    if (!taskInfo) {
      throw new Error("Не удалось получить информацию о задаче");
    }

    core.info(`Description: ${taskInfo.task.description}`);

    await WeeekApiInstance.updateTaskInfo(taskId, {
      description:
        (taskInfo.task.description || "") + getTaskComment(finalComment),
    });

    core.info("Комментарий успешно добавлен к задаче");
  } catch (error) {
    core.setFailed(`Ошибка: ${getErrorMessage(error)}`);
  }
};

run();
