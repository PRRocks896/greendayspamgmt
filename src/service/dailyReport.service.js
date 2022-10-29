import { get, post, getPDF } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const fetchDailyReport = (payload) => post(api.fetchDailyReport, payload);

export const createUpdateDailyReport = (payload) => post(api.createUpdateDailyReport, payload);

export const fetchByIdDailyReport = (id) => get(`${replaceUrlVariable(api.fetchByIdDailyReport, {id})}`);

export const downloadDailyReport = (body) => {
    return getPDF(`${replaceUrlVariable(api.fetchDailyReportGeneratePDF, body)}`);
}