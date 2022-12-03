export const endpoint = "https://greenapp.fabbang.com";

export const months = [1,2,3,4,5,6,7,8,9,10,11,12];

export const year = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

export const api = {
  login: "/v1/api/user/login",
  loginOtpSend: "/v1/api/user/Login-otp-send?phone={{phone}}",
  cityList: "/v1/api/user/get-city-list-dropdown",
  delete: "/v1/api/delete?ModuleName={{moduleName}}&id={{id}}",
  statusChange: "/v1/api/status",
  // User
  dashboard: "/v1/api/user/Dashboard-Details?BranchId={{branchId}}",
  // Branch
  branchList: "/v1/api/user/get-branch-list",
  createBranch: "/v1/api/user/create-User",
  updateBranch: "/v1/api/user/update-user",
  branchDropdownList: "/v1/api/user/get-branch-list-dropdown",
  branchById: "/v1/api/user/{{id}}",
  branchEmployeeReport: "/api/Report/employee-monthly-report-pdf?BranchId={{branchId}}&Month={{month}}&Year={{year}}",
  // Membership Plan
  membershipPlanList: "/v1/api/membershipPlan/get-membershipPlan-list",
  createMembershipPlan: "/v1/api/membershipPlan",
  membershipPlanId: "/v1/api/membershipPlan/{{id}}",
  membershipPlanDropDown: "/v1/api/membershipPlan/get-membershipPlan-list-dropdown",
  // Membership management
  membershipMgmtList: "/v1/api/membershipManagement/get-membershipManagement-list",
  createMembershipMgmt: "/v1/api/membershipManagement",
  memberhsipMgmtId: "/v1/api/membershipManagement/{{id}}",
  sendOtpToVerify: "/v1/api/membershipManagement//Send-ExtraHour-OTP?branchId={{branchId}}&extraHours={{extraHours}}",
  verifyOtp: "/v1/api/membershipManagement/Verified-ExtraHour-OTP?branchId={{branchId}}&OTP={{otp}}",
  sendOtpToSave: "/v1/api/membershipManagement/Send-Membership-OTP?PhoneNumber={{phoneNumber}}&branchId={{branchId}}",
  verifyOtpSave: "/v1/api/membershipManagement/Verified-Membership-OTP?PhoneNumber={{phoneNumber}}&OTP={{otp}}",
  // Paid Mode
  fetchPaidMode: "/v1/api/paidMode/get-paidMode-list",
  createUpdatePaidMode: "/v1/api/paidMode/addUpdate-PaidMode",
  fetchByIdPaidMode: "/v1/api/paidMode/{{id}}",
  fetchPaidModeDropDown: "/v1/api/paidMode/get-paidMode-list-dropdown",
  //Membership redeem
  fetchMembershipRedeemList: "/v1/api/membershipRedeem/get-membershipRedeem-list",
  fetchMembershipMembershipMgmtList: "/v1/api/membershipRedeem/get-membershipManagement-list?otp={{otp}}",
  fetchByIdMembershipRedeem: "/v1/api/membershipRedeem/{{id}}",
  createEditMembershipRedeem: "/v1/api/membershipRedeem/AddUpdate-MembershipRedeem-Web",
  fetchMembershipRedeemByPhoneNumber: "/v1/api/membershipRedeem/Detail-By-Phone?Phone={{phone}}",
  sendOtpForMembershipRedeem: "/v1/api/membershipRedeem/MembershipRedeem-otp-send?phone={{phone}}",
  membershipOtpSend: "/v1/api/membershipRedeem/MembershipRedeem-otp-send?phone={{phone}}&Minutes={{Minutes}}&ServiceDetail={{ServiceDetail}}",
  verifyOtpForMembershipRedee: "/v1/api/membershipRedeem?PhoneNumber={{PhoneNumber}}&OTP={{OTP}}",
  listByPhone: "/v1/api/membershipRedeem/List-By-Phone?Phone={{phoneNumber}}",
  detailByPhone: "/v1/api/membershipRedeem/Detail-By-Phone?Phone={{phoneNumber}}&BranchId={{branchId}}",
  // Employee
  createEmployee: "/v1/api/employee/AddUpdate-Employee-Web", //"/v1/api/employee",
  updateEmployee: "/v1/api/employee/Update-Employee",
  fetchEmployee: "/v1/api/employee/get-employee-list",
  fetchEmployeeById: "/v1/api/employee/{{id}}",
  employeeReport: "/api/Report/employee-report-pdf?EmployeeId={{employeeId}}&Month={{month}}&Year={{year}}",
  //Daily Report
  fetchDailyReport: "/v1/api/dailyReport/get-dailyReport-list",
  createUpdateDailyReport: "/v1/api/dailyReport/AddUpdateDailyReport_Web",
  fetchByIdDailyReport: "/v1/api/dailyReport/{{id}}",
  fetchDailyReportGeneratePDF: "/v1/api/dailyReport/get-dailyReport-generatepdf?BranchId={{branchId}}&Date={{date}}", 
  // Report
  fetchReportGeneratePDF: "/api/Report/Generate-Report-PDF?BranchId={{branchId}}&FromDate={{fromDate}}&ToDate={{toDate}}",
  // Attendance
  fetchAttendanceList: "/v1/api/attendance/get-employee-attendance-list",
  approveAttendance: "/v1/api/attendance",
  // Employee Type
  fetchEmployeeTypeList: "/v1/api/employeeType/get-employeeType-list",
  createUpdateEmployeeType: "/v1/api/employeeType",
  fetchByIdEmployeeType: "/v1/api/employeeType/{{id}}",
  fetchEmployeeTypeDropDown: "/v1/api/employeeType/get-employeeType-list-dropdown",
  // Advance Salary
  fetchAdvanceSalaryList: "/v1/api/advanceSalary/get-advanceSalary-list",
  createAdvanceSalary: "/v1/api/advanceSalary"
};
