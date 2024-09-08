"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const utils_1 = require("./utils");
const consts_1 = require("./consts");
const run = async () => {
    try {
        const weeekApiKey = core.getInput(consts_1.ActionInputs.weeekApiKey, { required: true });
        const branchName = core.getInput(consts_1.ActionInputs.branchName, { required: true });
        const comment = core.getInput(consts_1.ActionInputs.comment, { required: true });
        const userMappingJson = core.getInput(consts_1.ActionInputs.userMapping);
        const userMapping = userMappingJson ? JSON.parse(userMappingJson) : {};
        const taskIdMatch = branchName.match(/feature\/(\d+)/);
        if (!taskIdMatch) {
            core.setFailed(`Не удалось извлечь идентификатор задачи из ветки: ${branchName}`);
            return;
        }
        const taskId = taskIdMatch[1];
        core.info(`Найден идентификатор задачи: ${taskId}`);
        core.info(`github.context.ref: ${github.context.ref}`);
        const githubUsername = github.context.actor;
        const weeekUserId = userMapping[githubUsername];
        let finalComment = comment;
        if (weeekUserId) {
            finalComment = `${weeekUserId}: ${comment}`;
        }
        // await addCommentToTask(weeekApiKey, taskId, finalComment);
        core.info('Комментарий успешно добавлен к задаче Weeek');
    }
    catch (error) {
        core.setFailed(`Ошибка: ${(0, utils_1.getErrorMessage)(error)}`);
    }
};
run();
