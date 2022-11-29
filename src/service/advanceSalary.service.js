import { post } from "./web.request";
import { api } from "../utils/constant";

export const fetchAdvanceSalaryList = (payload) => post(api.fetchAdvanceSalaryList, payload);

export const createAdvanceSalary = (payload) => post(api.createAdvanceSalary, payload);