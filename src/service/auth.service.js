import { get, post } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const loginOtpSend = (phone) => get(`${replaceUrlVariable(api.loginOtpSend, { phone })}`);

export const loginOtpVerify = (payload) => post(`${api.login}`, payload);

export const logOut = (payload) => get(`${replaceUrlVariable(api.logOut, payload)}`);