import { get, post } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const fetchMembershipPlan = (payload) => post(api.membershipPlanList, payload);

export const createMembershipPlan = (payload) => post(api.createMembershipPlan, payload);

export const fetchByIdMembershipPlan = (id) =>
  get(`${replaceUrlVariable(api.membershipPlanId, { id })}`);

export const fetchMembershipPlanDropdown = () => get(api.membershipPlanDropDown);
