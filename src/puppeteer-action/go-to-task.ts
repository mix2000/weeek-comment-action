import joinUrl from "url-join";

export const goToTask = async (
  page,
  weeekDomain,
  weeekProjectId,
  weeekTaskId,
) => {
  const wsUrl = joinUrl(weeekDomain, "ws");
  const projectUrl = joinUrl(wsUrl, weeekProjectId);
  const taskUrl = joinUrl(projectUrl, "m/task", weeekTaskId);

  const setUrlSoftly = async (url) => {
    await page.evaluate((url) => {
      window.history.pushState({}, "", url);
      window.dispatchEvent(new Event("popstate"));
    }, url);
  };

  await setUrlSoftly(taskUrl);

  const taskWrapperSelector = ".task .task__wrapper";
  await page.waitForSelector(taskWrapperSelector);

  // Прокрутка до низа страницы
  await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollTo({ top: element.scrollHeight, behavior: "instant" });
    }
  }, taskWrapperSelector);
};
