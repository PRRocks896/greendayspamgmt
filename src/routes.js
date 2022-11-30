import { Suspense, lazy } from "react";

// @mui icons
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";

import SignIn from "layouts/authentication/sign-in";

// Material Dashboard 2 React layouts
const AddEditBranch = lazy(() => import("layouts/branch/component/addEdit"));
const AddEditMembershipPlan = lazy(() => import("layouts/membershipplan/component/addEdit"));
const AddEditMembershipMgmt = lazy(() => import("layouts/membership-mgmt/component/addEdit"));
const AddEditPaidMode = lazy(() => import("layouts/paid/component/addEdit"));
const AddEditEmployeeType = lazy(() => import("layouts/employeType/component/addEdit"));
const AddEditEmployee = lazy(() => import("layouts/employee/component/addEdit"));
const AddEditDailyReport = lazy(() => import("layouts/dailyReport/component/addEdit"));
const AddAdvanceSalary = lazy(() => import("layouts/advanceSalary/components/add"));
const Branch = lazy(() => import("layouts/branch"));
const Dashboard = lazy(() => import("layouts/dashboard"));
const Employee = lazy(() => import("layouts/employee"));
const MembershipPlan = lazy(() => import("layouts/membershipplan"));
const MembershipMgmt = lazy(() => import("layouts/membership-mgmt"));
const MembershipRedeem = lazy(() => import("layouts/membership-redeem"));
const PaidMode = lazy(() => import("layouts/paid"));
const EmployeeType = lazy(() => import("layouts/employeType"));
const DailyReport = lazy(() => import("layouts/dailyReport"));
const Report = lazy(() => import("layouts/report"));
const Attendance = lazy(() => import("layouts/attendance"));
const AdvanceSalary = lazy(() => import("layouts/advanceSalary"));

export const Loading = () => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    zIndex: 99,
    position: "fixed",
    left: "50%",
    top: "50%"  
  }}>
    <CircularProgress color="inherit"/>
  </Box>
);

export const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <Suspense fallback={<Loading/>}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Branch",
    key: "branch",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/branch",
    component: (
      <Suspense fallback={<Loading/>}>
        <Branch />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    href: true,
    name: "Branch",
    key: "branch",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/branch/:mode/:id",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditBranch />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    href: true,
    name: "Branch",
    key: "branch",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/branch/:mode",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditBranch />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Employee",
    key: "employee",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/employee",
    component: (
      <Suspense fallback={<Loading/>}>
        <Employee />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Employee",
    key: "employee",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/employee/:mode",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditEmployee />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Employee",
    key: "employee",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/employee/:mode/:id",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditEmployee />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Attendance",
    key: "attendance",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/attendance",
    component: (
      <Suspense fallback={<Loading/>}>
        <Attendance />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Advance Salary",
    key: "advanceSalary",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/advanceSalary",
    component: (
      <Suspense fallback={<Loading/>}>
        <AdvanceSalary/>
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Advance Salary",
    key: "advanceSalary",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/advanceSalary/:mode",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddAdvanceSalary />
      </Suspense>
    ),
  },
  {
    type: "title",
    title: "Membership"
  },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Membership Plan",
    key: "membershipplan",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/membershipplan",
    component: (
      <Suspense fallback={<Loading/>}>
        <MembershipPlan />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Membership Plan",
    key: "membershipplan",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/membershipplan/:mode",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditMembershipPlan />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Membership Plan",
    key: "membershipplan",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/membershipplan/:mode/:id",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditMembershipPlan />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Membership Management",
    key: "membershipmgmt",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/membershipmgmt",
    component: (
      <Suspense fallback={<Loading/>}>
        <MembershipMgmt />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Membership Management",
    key: "membershipmgmt",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/membershipmgmt/:mode",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditMembershipMgmt />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Membership Management",
    key: "membershipmgmt",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/membershipmgmt/:mode/:id",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditMembershipMgmt />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Membership Redeem",
    key: "membership-redeem",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/membership-redeem",
    component: (
      <Suspense fallback={<Loading/>}>
        <MembershipRedeem />
      </Suspense>
    ),
  },
  {
    type: "title",
    title: "Reports"
  },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Daily Report",
    key: "daily-report",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/daily-report",
    component: (
      <Suspense fallback={<Loading/>}>
        <DailyReport />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Daily Report",
    key: "daily-report",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/daily-report/:mode",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditDailyReport />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Daily Report",
    key: "daily-report",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/daily-report/:mode/:id",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditDailyReport />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Report",
    key: "report",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/report",
    component: (
      <Suspense fallback={<Loading/>}>
        <Report />
      </Suspense>
    ),
  },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Paid Mode",
    key: "paidmode",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/paidmode",
    component: (
      <Suspense fallback={<Loading/>}>
        <PaidMode />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Paid Mode",
    key: "paidmode",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/paidmode/:mode",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditPaidMode/>
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Paid Mode",
    key: "paidmode",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/paidmode/:mode/:id",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditPaidMode/>
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Employee Type",
    key: "employeetype",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/employeetype",
    component: (
      <Suspense fallback={<Loading/>}>
        <EmployeeType />
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Employee Type",
    key: "employeetype",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/employeetype/:mode",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditEmployeeType/>
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Employee Type",
    key: "employeetype",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/employeetype/:mode/:id",
    component: (
      <Suspense fallback={<Loading/>}>
        <AddEditEmployeeType/>
      </Suspense>
    ),
  },
  {
    type: "divider",
  },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: (
  //     <Suspense fallback={<Loading/>}>
  //       <Profile />
  //     </Suspense>
  //   ),
  // },
  {
    type: "logout",
    name: "Sign Out",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/",
    component: <SignIn />,
  },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
];
