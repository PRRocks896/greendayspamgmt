import { get, post } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const sendMembershipRedeemOtpSend = (phone) => get(`${replaceUrlVariable(api.sendOtpForMembershipRedeem, { phone })}`);

export const fetchMembershipRedeem = (phone) => get(`${replaceUrlVariable(api.fetchMembershipRedeemByPhoneNumber, { phone })}`);

export const createUpdateMembershipRedeem = (payload) => post(api.createEditMembershipRedeem, payload);

export const getVerifyToRedeemMembership = (payload) => get(`${replaceUrlVariable(api.membershipOtpSend, payload)}`);

export const verifyOtpForRedeemMembership = (payload) => get(`${replaceUrlVariable(api.verifyOtpForMembershipRedee, payload)}`);

export const listOfPhone = (payload) => get(`${replaceUrlVariable(api.listByPhone, payload)}`);

export const detailOfPhone = (payload) => get(`${replaceUrlVariable(api.detailByPhone, payload)}`);

export const importExcelMembershipRedeem = (payload) => post(api.importExcelMembershipRedeem, payload);