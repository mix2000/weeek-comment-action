import joinUrl from "url-join";
import { getErrorMessage } from "../utils";
import * as core from "@actions/core";

export const authorize = async (
  page,
  weeekLogin,
  weeekPassword,
  weeekDomain,
  weeekApiDomain,
) => {
  const signInUrl = joinUrl(weeekDomain, "sign-in");
  const authUrl = joinUrl(weeekApiDomain, "auth/login");

  await page.goto(signInUrl, { waitUntil: "networkidle2" });

  console.log('after goto auth');

  const loginSelector = "form input[type=email]";
  const passwordSelector = "form input[type=password]";
  const submitButtonSelector = "form button";

  await page.waitForSelector(loginSelector, { visible: true });
  console.log('after login input');
  await page.waitForSelector(passwordSelector, { visible: true });
  console.log('after password input');
  await page.waitForSelector(submitButtonSelector, { visible: true });
  console.log('after submit input');

  await page.type(loginSelector, weeekLogin);
  await page.type(passwordSelector, weeekPassword);
  await page.click(submitButtonSelector);

  const response = await page.waitForResponse(
    (res) => res.request().method() === "POST" && res.url() === authUrl,
  );

  console.log('after login response');

  if (response.ok()) {
    core.info("Успешный вход в Weeek");
  } else {
    throw new Error(
      `Не удалось войти в Weeek: ${getErrorMessage(response.statusText())}`,
    );
  }

  await page.click(submitButtonSelector);
};
