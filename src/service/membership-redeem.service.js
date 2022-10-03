import { get, post } from "./web.request";
import { api } from "../utils/constant";
import { replaceUrlVariable } from "../utils/helper";

export const sendMembershipRedeemOtpSend = (phone) => get(`${replaceUrlVariable(api.sendOtpForMembershipRedeem, { phone })}`);

export const fetchMembershipRedeem = (phoneNumber, otp) => get(`${replaceUrlVariable(api.fetchMembershipRedeemByPhoneNumber, { phoneNumber, otp})}`);

export const createUpdateMembershipRedeem = (payload) => post(api.createEditMembershipRedeem, payload);