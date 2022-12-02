import { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { fetchMembershipMgmt } from "service/membership-mgmt.service";
import { statusChange, deleteRecord } from "service/user.service";
import { showToast, isAdmin, getUserData, confirmationBox } from "utils/helper";

function MembershipMgmt() {
  const [rows, setRows] = useState([]);
  // const columns = [
  //   { Header: "billNo", accessor: "billNo", align: "left" },
  //   { Header: "customerName", accessor: "customerName", align: "left" },
  //   { Header: "phoneNumber", accessor: "phoneNumber", align: "left" },
  //   { Header: "membershipPlanId", accessor: "membershipPlanId", align: "left" },
  //   { Header: "paidBy", accessor: "paidBy", align: "left" },
  //   { Header: "managerName", accessor: "managerName", align: "left" },
  //   { Header: "branchName", accessor: "branchName", align: "left" },
  //   { Header: "cityName", accessor: "cityName", align: "left" },
    // { Header: "status", accessor: "isActive", align: "center"},
    // { Header: "action", accessor: "action", align: "center" },
  // ];

  const columns = useCallback(() => {
    if(isAdmin()) {
      return [
        { Header: "billNo", accessor: "billNo", align: "left" },
        { Header: "customerName", accessor: "customerName", align: "left" },
        { Header: "phoneNumber", accessor: "phoneNumber", align: "left" },
        { Header: "membershipPlanId", accessor: "membershipPlanId", align: "left" },
        { Header: "paidBy", accessor: "paidBy", align: "left" },
        { Header: "managerName", accessor: "managerName", align: "left" },
        { Header: "branchName", accessor: "branchName", align: "left" },
        { Header: "cityName", accessor: "cityName", align: "left" },
        { Header: "status", accessor: "isActive", align: "center"},
        { Header: "action", accessor: "action", align: "center" },
      ]
    } else {
      return [
        { Header: "billNo", accessor: "billNo", align: "left" },
        { Header: "customerName", accessor: "customerName", align: "left" },
        { Header: "phoneNumber", accessor: "phoneNumber", align: "left" },
        { Header: "membershipPlanId", accessor: "membershipPlanId", align: "left" },
        { Header: "paidBy", accessor: "paidBy", align: "left" },
        { Header: "managerName", accessor: "managerName", align: "left" },
        { Header: "branchName", accessor: "branchName", align: "left" },
        { Header: "cityName", accessor: "cityName", align: "left" },
      ]
    }
  }, []);

  const navigate = useNavigate();

  const handleDelete = useCallback(async (id) => {
    if(confirmationBox("Are You Sure...?")) {
      const response = await deleteRecord({
        moduleName: "MembershipManagement",
        id
      });
      if(response.status === 200) {
        const response = await fetchMembershipMgmt({
          searchText: "",
          // isActive: true,
          page: 0,
          size: 1000,
          cityId: isAdmin() ? 0 : getUserData().cityId,
          branchId: isAdmin() ? 0 : getUserData().userId,
        });
        if (response.status === 200 && response.resultObject?.data?.length > 0) {
          setRows(response.resultObject.data);
        }
      }
    }
  }, []);

  const handleChangeStatus = useCallback(async (value, id) => {
    const response = await statusChange({
      moduleName: "MembershipManagement",
      id,
      isActive: value
    });
    if(response.status === 200) {
      const response = await fetchMembershipMgmt({
        searchText: "",
        // isActive: true,
        page: 0,
        size: 1000,
        cityId: isAdmin() ? 0 : getUserData().cityId,
        branchId: isAdmin() ? 0 : getUserData().userId,
      });
      if (response.status === 200 && response.resultObject?.data?.length > 0) {
        setRows(response.resultObject.data);
      }
    }
  }, []);

  useEffect(() => {
    try {
      async function membershipMgmt() {
        const response = await fetchMembershipMgmt({
          searchText: "",
          // isActive: true,
          page: 0,
          size: 1000,
          cityId: isAdmin() ? 0 : getUserData().cityId,
          branchId: isAdmin() ? 0 : getUserData().userId,
        });
        if (response.status === 200 && response.resultObject?.data?.length > 0) {
          setRows(response.resultObject.data);
        }
      }
      membershipMgmt();
    } catch (err) {
      showToast(err.message, false);
    }
  }, [navigate, setRows]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                display="grid"
                gridTemplateColumns="1fr 1fr"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Membership Management
                </MDTypography>
                <MDTypography
                  variant="h6"
                  component={Link}
                  to="/membershipmgmt/add"
                  borderRadius="lg"
                  color="white"
                  textAlign="end"
                >
                  <Icon fontSize="large">add</Icon>
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: columns(), rows: rows?.map((data, index) => {
                    return {
                      ...data,
                      isActive: (
                        <Switch checked={data?.isActive} onChange={(e) => handleChangeStatus(e.target.checked, data.membershipManagementId)} />
                      ),
                      action: (
                        <>
                        <MDTypography
                          component="span"
                          onClick={() => navigate(`/membershipmgmt/edit/${data.membershipManagementId}`)}
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          style={{ cursor: "pointer" }}
                        >
                          <Icon fontSize="medium">edit</Icon>
                        </MDTypography>
                        <MDTypography
                        component="span"
                        onClick={() => handleDelete(data.membershipManagementId)}
                        variant="caption"
                        color="text"
                        fontWeight="medium"
                        style={{ cursor: "pointer" }}
                      >
                        <Icon fontSize="medium">delete</Icon>
                      </MDTypography>
                      </>
                      ),
                    };}) 
                  }}
                  canSearch={true}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default MembershipMgmt;
