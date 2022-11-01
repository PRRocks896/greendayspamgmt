import { get } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable, getUserData } from "../utils/helper";

export const fetchDashboard = () => get(`${replaceUrlVariable(api.dashboard, {branchId: getUserData().userId})}`);