import { post } from "./web.request";
import { api } from "../utils/constant";

export const fetchAttendanceList = (payload) => post(api.fetchAttendanceList, payload);

export const approveAttendance = (payload) => post(api.approveAttendance, payload);