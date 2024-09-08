// UpdateTaskInfo

/**
 * Key-value object with custom field id and custom field value for the task
 *
 * For example
 *
 * ```
 * "customFields" : {
 * "<text_custom_field_id>": "Text value",
 * "<boolean_custom_field_id>": true,
 * "<datetime_custom_field_id>": "<ISO 8601 datetime string>",
 * "<select_custom_field_id>": "<custom_field_option_id>"
 * "<multiselect_custom_field_id>": ["<custom_field_option_id>"],
 * "<member_custom_field_id>": ["<user_id>"],
 * "<contact_custom_field_id>": "<contact_id>",
 * "<link_custom_field_id>": "Link value",
 * "<approval_custom_field_id>": ["<user_id>"]
 * }
 * ```
 */
export type TaskCustomFields = {};

export enum TaskType {
  Action = "action",
  Call = "call",
  Meet = "meet",
}

export type UpdateTaskInfoRequest = {
  boardColumnId?: number | null;
  boardId?: number | null;
  /**
   * Key-value object with custom field id and custom field value for the task
   *
   * For example
   *
   * ```
   * "customFields" : {
   * "<text_custom_field_id>": "Text value",
   * "<boolean_custom_field_id>": true,
   * "<datetime_custom_field_id>": "<ISO 8601 datetime string>",
   * "<select_custom_field_id>": "<custom_field_option_id>"
   * "<multiselect_custom_field_id>": ["<custom_field_option_id>"],
   * "<member_custom_field_id>": ["<user_id>"],
   * "<contact_custom_field_id>": "<contact_id>",
   * "<link_custom_field_id>": "Link value",
   * "<approval_custom_field_id>": ["<user_id>"]
   * }
   * ```
   */
  customFields?: TaskCustomFields;
  /**
   * Html description of the task
   */
  description?: null | string;
  /**
   * The due date of the task in Y-m-d format. Cannot be provided with startDateTime or
   * dueDateTime
   */
  dueDate?: Date | null;
  /**
   * The due datetime of the task in ISO 8601 format. Cannot be provided with startDate or
   * dueDate
   */
  dueDateTime?: Date | null;
  priority?: number;
  projectId?: number | null;
  /**
   * The start date of the task in Y-m-d format.
   * Cannot be provided with startDateTime or dueDateTime
   */
  startDate?: Date | null;
  /**
   * The start datetime of the task in ISO 8601 format. Cannot be provided with startDate or
   * dueDate
   */
  startDateTime?: Date | null;
  /**
   * Array of tag ids
   */
  tags?: number[];
  title?: null | string;
  type?: TaskType;
  [property: string]: any;
};

// GetTaskInfo

/**
 * Task
 */
export type Task = {
  attachments?: Attachment[];
  /**
   * ID of the user who created the task
   */
  authorId?: string;
  boardColumnId?: number | null;
  boardId?: number | null;
  /**
   * Date the task was created in ISO 8601 format
   */
  createdAt: Date;
  customFields?: CustomFieldValue[];
  description?: null | string;
  /**
   * Due date of the task in `Y-m-d` format
   */
  dueDate?: Date | null;
  /**
   * Due date of the task in ISO 8601 format
   */
  dueDateTime?: Date | null;
  /**
   * In minutes
   */
  duration?: number | null;
  id?: number;
  image?: null | string;
  isCompleted?: boolean;
  isPrivate?: boolean;
  parentId?: number | null;
  /**
   * 0 - Low
   * 1 - Medium
   * 2 - High
   * 3 - Hold
   */
  priority?: number | null;
  projectId?: number | null;
  /**
   * Start date of the task in `Y-m-d` format
   */
  startDate?: Date | null;
  /**
   * Start date of the task in ISO 8601 format
   */
  startDateTime?: Date | null;
  subscribers?: string[];
  subTasks?: number[];
  tags?: number[];
  timeEntries: TimeEntry[];
  title?: string;
  type?: TaskType;
  /**
   * Date the task was last updated in ISO 8601 format
   */
  updatedAt: Date;
  /**
   * ID of the user who is executing the task
   */
  userId?: null | string;
  workloads?: Workload[];
  [property: string]: any;
};

/**
 * Attachment
 */
export type Attachment = {
  createdAt: Date;
  creatorId: string;
  id: string;
  name: string;
  service: AttachmentServiceEnum;
  /**
   * The size of the attachment in bytes. Only present when `service` is `weeek`
   */
  size?: number;
  /**
   * Attachment URL. If `service` is `weeek`, this URL will be available for an hour.
   */
  url: string;
  [property: string]: any;
};

/**
 * AttachmentServiceEnum
 */
export enum AttachmentServiceEnum {
  Box = "box",
  Dropbox = "dropbox",
  GoogleDrive = "google_drive",
  OneDrive = "one_drive",
  Weeek = "weeek",
}

/**
 * CustomFieldValue
 */
export type CustomFieldValue = {
  config?: null | Config;
  id?: string;
  name?: null | string;
  /**
   * Only for select and multiselect custom fields
   */
  options: CustomFieldOption[];
  type: CustomFieldType;
  value: any[] | boolean | number | { [key: string]: any } | null | string;
  [property: string]: any;
};

export type Config = {
  /**
   * Only for boolean custom fields
   */
  type: ConfigType;
  [property: string]: any;
};

/**
 * Only for boolean custom fields
 */
export enum ConfigType {
  Checkbox = "checkbox",
  Switch = "switch",
}

/**
 * CustomFieldOption
 */
export type CustomFieldOption = {
  color: Color;
  id?: string;
  name: string;
  [property: string]: any;
};

export enum Color {
  Blue = "blue",
  DarkGreen = "dark_green",
  DarkPink = "dark_pink",
  DarkPurple = "dark_purple",
  DarkYellow = "dark_yellow",
  Green = "green",
  LightBlue = "light_blue",
  LightGreen = "light_green",
  LightPink = "light_pink",
  Pink = "pink",
  Purple = "purple",
  Red = "red",
}

export enum CustomFieldType {
  Approval = "approval",
  Boolean = "boolean",
  Contact = "contact",
  Datetime = "datetime",
  Link = "link",
  Member = "member",
  Multiselect = "multiselect",
  Select = "select",
  Text = "text",
}

/**
 * Time entry
 */
export type TimeEntry = {
  /**
   * The day of entry. In `Y-m-d` format
   */
  date: Date;
  /**
   * Time in minutes, cannot exceed 1440
   */
  duration: number;
  id: string;
  /**
   * A flag indicating that the entry was overtime
   */
  isOvertime: boolean;
  type: number;
  userId: string;
  [property: string]: any;
};

export type Workload = {
  date?: string;
  duration?: number;
  id?: string;
  /**
   * 1 - auto calculated from timer
   * 2 - manual added
   */
  type?: number;
  userId?: string;
  workEndAt?: null | string;
  workStartAt?: null | string;
  [property: string]: any;
};

export type GetTaskInfoResponse = {
  success?: boolean;
  task?: Task;
  [property: string]: any;
};
