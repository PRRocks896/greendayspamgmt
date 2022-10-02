import { get, post } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const fetchPaidMode = (payload) => post(api.fetchPaidMode, payload);

export const createUpdatePaidMode = (payload) => post(api.createUpdatePaidMode, payload);

export const fetchPaidModeDropDown = () => get(api.fetchPaidModeDropDown);

export const fetchByIdPaidMode = (id) =>
  get(`${replaceUrlVariable(api.fetchByIdPaidMode, { id })}`);
