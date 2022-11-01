export const endpoint = "https://greenapp.fabbang.com";

export const api = {
  login: "/v1/api/user/login",
  loginOtpSend: "/v1/api/user/Login-otp-send?phone={{phone}}",
  cityList: "/v1/api/user/get-city-list-dropdown",
  // User
  dashboard: "/v1/api/user/Dashboard-Details?BranchId={{branchId}}",
  // Branch
  branchList: "/v1/api/user/get-branch-list",
  createBranch: "/v1/api/user/create-User",
  updateBranch: "/v1/api/user/update-user",
  branchDropdownList: "/v1/api/user/get-branch-list-dropdown",
  branchById: "/v1/api/user/{{id}}",
  // Membership Plan
  membershipPlanList: "/v1/api/membershipPlan/get-membershipPlan-list",
  createMembershipPlan: "/v1/api/membershipPlan",
  membershipPlanId: "/v1/api/membershipPlan/{{id}}",
  membershipPlanDropDown: "/v1/api/membershipPlan/get-membershipPlan-list-dropdown",
  // Membership management
  membershipMgmtList: "/v1/api/membershipManagement/get-membershipManagement-list",
  createMembershipMgmt: "/v1/api/membershipManagement",
  memberhsipMgmtId: "/v1/api/membershipManagement/{{id}}",
  sendOtpToVerify: "/v1/api/membershipManagement/{{branchId}}",
  verifyOtp: "/v1/api/membershipManagement/Verified-ExtraHour-OTP?branchId={{branchId}}&OTP={{otp}}",
  // Paid Mode
  fetchPaidMode: "/v1/api/paidMode/get-paidMode-list",
  createUpdatePaidMode: "/v1/api/paidMode/addUpdate-PaidMode",
  fetchByIdPaidMode: "/v1/api/paidMode/{{id}}",
  fetchPaidModeDropDown: "/v1/api/paidMode/get-paidMode-list-dropdown",
  //Membership redeem
  fetchMembershipRedeemList: "/v1/api/membershipRedeem/get-membershipRedeem-list",
  fetchMembershipMembershipMgmtList: "/v1/api/membershipRedeem/get-membershipManagement-list?otp={{otp}}",
  fetchByIdMembershipRedeem: "/v1/api/membershipRedeem/{{id}}",
  createEditMembershipRedeem: "/v1/api/membershipRedeem",
  fetchMembershipRedeemByPhoneNumber: "/v1/api/membershipRedeem?PhoneNumber={{phoneNumber}}&OTP={{otp}}",
  sendOtpForMembershipRedeem: "/v1/api/membershipRedeem/MembershipRedeem-otp-send?phone={{phone}}",
  // Employee
  createEmployee: "/v1/api/employee/AddUpdate-Employee-Web", //"/v1/api/employee",
  updateEmployee: "/v1/api/employee/Update-Employee",
  fetchEmployee: "/v1/api/employee/get-employee-list",
  fetchEmployeeById: "/v1/api/employee/{{id}}",
  //Daily Report
  fetchDailyReport: "/v1/api/dailyReport/get-dailyReport-list",
  createUpdateDailyReport: "/v1/api/dailyReport/AddUpdateDailyReport_Web",
  fetchByIdDailyReport: "/v1/api/dailyReport/{{id}}",
  fetchDailyReportGeneratePDF: "/v1/api/dailyReport/get-dailyReport-generatepdf?BranchId={{branchId}}&Date={{date}}", 
  // Report
  fetchReportGeneratePDF: "/api/Report/Generate-Report-PDF?BranchId={{branchId}}&FromDate={{fromDate}}&ToDate={{toDate}}"
};
