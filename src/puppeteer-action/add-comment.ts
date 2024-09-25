export const addComment = async (page, comment) => {
  const inputPlaceholderSelector = ".empty__placeholder";
  const inputFieldSelector = ".input [contenteditable=true] p";
  const sendButtonSelector = "button.data__button-send";

  await page.waitForSelector(inputPlaceholderSelector);
  await page.click(inputPlaceholderSelector);

  await page.waitForSelector(inputFieldSelector);
  await page.type(inputFieldSelector, comment);

  await page.waitForSelector(sendButtonSelector);
  await page.click(sendButtonSelector);

  await page.waitForResponse(
    (res) =>
      res
        .url()
        .match(/.*\/ws\/[a-zA-Z0-9]+\/tm\/tasks\/[a-zA-Z0-9]+\/comments/) &&
      res.status() > 200 &&
      res.status() < 300,
  );
};
