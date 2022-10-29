import { getPDF } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const downloadReport = (body) => {
    return getPDF(`${replaceUrlVariable(api.fetchReportGeneratePDF, body)}`);
}
