import axios from "axios";
import { EnvVars } from "../common/getEnv";

export const GetRecaptcha = async (
  response: string,
  remoteip: string,
): Promise<boolean> => {
  const HEADERS = {
    "Content-type": "application/x-www-form-urlencoded",
  };

  if (EnvVars.NODE_ENV !== "production") {
    remoteip = "127.0.0.1";
  }

  const PARAMS = {
    secret: EnvVars.RECAPTCHA_SECRET_KEY,
    response,
    remoteip,
  };

  const IS_RECAPTCHA_VALID = await axios({
    method: "post",
    url: "https://www.google.com/recaptcha/api/siteverify",
    headers: HEADERS,
    params: PARAMS,
  });

  return IS_RECAPTCHA_VALID.data.success;
};
