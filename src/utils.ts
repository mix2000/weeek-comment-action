export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export const getTaskComment = (comment: string): string => {
  return `<p>\n${Array(10).fill("-").join("")}\n\n${comment}</p>`;
};

export const getTaskIdFromBranchName = (branchName: string): string | null => {
  const match = branchName.match(/feature\/(\d+)/);

  return match?.[1] || null;
};
