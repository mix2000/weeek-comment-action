import "dotenv/config";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export const getTaskComment = (comment: string): string => {
  return `<p><br/><br/>${Array(10).fill("-").join("")}<br/><br/>${comment}</p>`;
};

export const getTaskIdFromBranchName = (branchName: string): string | null => {
  // Регулярное выражение, которое охватывает различные типы веток и работает без учета регистра
  const match = branchName
    .toLowerCase()
    .match(/(feature|feat|bugfix|bug|fix)\/(\d+)/);

  // Возвращаем идентификатор задачи, если он найден
  return match?.[2] || null;
};

export const getActionInput = (field: string): string | null => {
  return process.env[field] || null;
};
