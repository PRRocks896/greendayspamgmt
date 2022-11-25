import { get, post } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const fetchEmployeeTypeList = (payload) => post(api.fetchEmployeeTypeList, payload);

export const createUpdateEmployeeType = (payload) => post(api.createUpdateEmployeeType, payload);

export const fetchEmployeeTypeDropDown = () => get(api.fetchEmployeeTypeDropDown);

export const fetchByIdEmployeeType = (id) =>
  get(`${replaceUrlVariable(api.fetchByIdEmployeeType, { id })}`);
