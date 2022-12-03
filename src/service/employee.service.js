import { get, post } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const fetchEmployee = (payload) => post(api.fetchEmployee, payload);

export const fetchByIdEmployee = (id) => get(replaceUrlVariable(api.fetchEmployeeById, { id }));

export const createEmployee = (payload) => post(api.createEmployee, payload);

export const updateEmployee = (payload) => post(api.updateEmployee, payload);

