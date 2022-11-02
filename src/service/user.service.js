import { get, post, remove } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable, getUserData } from "../utils/helper";

export const fetchDashboard = () => get(`${replaceUrlVariable(api.dashboard, {branchId: getUserData().userId})}`);

export const deleteRecord = (payload) => remove(`${replaceUrlVariable(api.delete, payload)}`, null);

export const statusChange = (payload) => post(api.statusChange, payload);