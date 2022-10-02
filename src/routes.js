import { Suspense, lazy } from "react";

// @mui icons
import Icon from "@mui/material/Icon";

import SignIn from "layouts/authentication/sign-in";

// Material Dashboard 2 React layouts
const AddEditBranch = lazy(() => import("layouts/branch/component/addEdit"));
const AddEditMembershipPlan = lazy(() => import("layouts/membershipplan/component/addEdit"));
const AddEditMembershipMgmt = lazy(() => import("layouts/membership-mgmt/component/addEdit"));
const AddEditPaidMode = lazy(() => import("layouts/paid/component/addEdit"));
const AddEditEmployee = lazy(() => import("layouts/employee/component/addEdit"));
const Branch = lazy(() => import("layouts/branch"));
const Dashboard = lazy(() => import("layouts/dashboard"));
const Employee = lazy(() => import("layouts/employee"));
const MembershipPlan = lazy(() => import("layouts/membershipplan"));
const MembershipMgmt = lazy(() => import("layouts/membership-mgmt"));
const MembershipRedeem = lazy(() => import("layouts/membership-redeem"));
const PaidMode = lazy(() => import("layouts/paid"));
// const Profile = lazy(() => import("layouts/profile"));
// const SignIn = lazy(() => import("layouts/authentication/sign-in"));


export const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
        <AddEditBranch />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Membership Redeem",
    key: "membershipRedeem",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/membership-redeem",
    component: (
      <Suspense fallback={<div>Loading...</div>}>
        <MembershipRedeem />
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
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
        <AddEditEmployee />
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
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
        <AddEditMembershipMgmt />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Membership Plan",
    key: "membershipplan",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/membershipplan",
    component: (
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
        <AddEditMembershipPlan />
      </Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Paid Mode",
    key: "paidmode",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/paidmode",
    component: (
      <Suspense fallback={<div>Loading...</div>}>
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
      <Suspense fallback={<div>Loading...</div>}>
        <AddEditPaidMode/>
      </Suspense>
    ),
  },
  {
    type: "subComponent",
    name: "Membership Plan",
    key: "membershipplan",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/paidmode/:mode/:id",
    component: (
      <Suspense fallback={<div>Loading...</div>}>
        <AddEditPaidMode/>
      </Suspense>
    ),
  },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: (
  //     <Suspense fallback={<div>Loading...</div>}>
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
