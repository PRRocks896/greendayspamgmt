import { get, post } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const fetchBranchList = (payload) => post(api.branchList, payload);

export const createBranch = (payload) => post(api.createBranch, payload);

export const updateBranch = (payload) => post(api.updateBranch, payload);

export const fetchByIdBranch = (id) => get(`${replaceUrlVariable(api.branchById, { id })}`);

export const fetchBranchDropdownList = () => get(api.branchDropdownList);
