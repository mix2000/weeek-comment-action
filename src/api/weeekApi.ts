import axios from 'axios';
import * as core from '@actions/core';
import {getErrorMessage} from "../utils";

export const addCommentToTask = async (apiKey: string, taskId: string, comment: string) => {
    try {
        const response = await axios.post(
            `https://api.weeek.net/tasks/${taskId}/comments`,
            { text: comment },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        core.info(`Ответ от Weeek API: ${response.status}`);
    } catch (error) {
        core.setFailed(`Ошибка при отправке комментария в Weeek: ${getErrorMessage(error)}`);
    }
};
