import axios, { AxiosInstance } from "axios";
import * as core from "@actions/core";
import { getErrorMessage } from "../../utils";
import { GetTaskInfoResponse, UpdateTaskInfoRequest } from "./types";

export class WeeekAPI {
  private readonly axiosInstance : AxiosInstance;

  constructor(apiKey: string) {
    this.axiosInstance = axios.create({
      baseURL: "https://api.weeek.net",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async getTaskInfo(taskId: string): Promise<GetTaskInfoResponse | null> {
    try {
      const response = await this.axiosInstance.get<GetTaskInfoResponse>(
        `/public/v1/tm/tasks/${taskId}`,
      );

      return response.data;
    } catch (error) {
      core.setFailed(
        `Ошибка при получении информации о задаче в Weeek: ${getErrorMessage(error)}`,
      );

      return null;
    }
  }

  async updateTaskInfo(taskId: string, info: UpdateTaskInfoRequest) {
    try {
      return await this.axiosInstance.put(`/public/v1/tm/tasks/${taskId}`, info);
    } catch (error) {
      core.setFailed(
        `Ошибка при обновлении задачи в Weeek: ${getErrorMessage(error)}`,
      );
    }
  }
}
