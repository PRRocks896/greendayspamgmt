import { get, post } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const fetchMembershipMgmt = (payload) => post(api.membershipMgmtList, payload);

export const createMembershipMgmt = (payload) => post(api.createMembershipMgmt, payload);

export const fetchByIdMembershipMgmt = (id) =>
  get(`${replaceUrlVariable(api.memberhsipMgmtId, { id })}`);

export const sendOtp = (branchId, extraHours) => get(`${replaceUrlVariable(api.sendOtpToVerify, { branchId, extraHours })}`);

export const verifyOtp = (branchId, otp) => get(`${replaceUrlVariable(api.verifyOtp, {branchId, otp})}`);