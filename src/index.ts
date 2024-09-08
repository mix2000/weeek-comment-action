import * as core from '@actions/core';
import * as github from '@actions/github';
import { addCommentToTask } from './api';
import {getErrorMessage} from "./utils";
import {ActionInputs} from "./consts";

interface UserMapping {
    [key: string]: string;
}

const run = async () => {
    try {
        const weeekApiKey = core.getInput(ActionInputs.weeekApiKey, { required: true });
        const branchName = core.getInput(ActionInputs.branchName, { required: true });
        const comment = core.getInput(ActionInputs.comment, { required: true });
        const userMappingJson = core.getInput(ActionInputs.userMapping);

        const userMapping: UserMapping = userMappingJson ? JSON.parse(userMappingJson) : {};

        const taskIdMatch = branchName.match(/feature\/(\d+)/);

        core.info(`github.context.ref: ${github.context.ref}`);

        if (!taskIdMatch) {
            core.setFailed(`Не удалось извлечь идентификатор задачи из ветки: ${branchName}`);
            return;
        }

        const taskId = taskIdMatch[1];
        core.info(`Найден идентификатор задачи: ${taskId}`);

        const githubUsername = github.context.actor;
        const weeekUserId = userMapping[githubUsername];

        let finalComment = comment;

        if (weeekUserId) {
            finalComment = `${weeekUserId}: ${comment}`;
        }

        // await addCommentToTask(weeekApiKey, taskId, finalComment);

        core.info('Комментарий успешно добавлен к задаче Weeek');
    } catch (error) {
        core.setFailed(`Ошибка: ${getErrorMessage(error)}`);
    }
};

run();
