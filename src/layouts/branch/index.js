/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { fetchBranchList } from "service/branch.service";
import { showToast } from "utils/helper";

function Branch() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([
    { Header: "Id", accessor: "branchId", width: "15%", align: "left" },
    { Header: "branchName", accessor: "branchName", align: "left" },
    { Header: "cityName", accessor: "cityName", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ]);
  const navigate = useNavigate();

  const jumpToEdit = (id) => {
    navigate(`/branch/edit/${id}`);
  };

  useEffect(async () => {
    try {
      const response = await fetchBranchList({
        cityId: 0,
        searchText: "",
        isActive: true,
        page: 0,
        size: 100,
      });
      if (response.status === 200 && response.resultObject?.data?.length > 0) {
        const updatedData = response.resultObject.data?.map((data, index) => {
          return {
            ...data,
            action: (
              <MDTypography
                component="span"
                onClick={() => jumpToEdit(data.branchId)}
                variant="caption"
                color="text"
                fontWeight="medium"
                style={{ cursor: "pointer" }}
              >
                <Icon fontSize="medium">edit</Icon>
                {/* Edit */}
              </MDTypography>
            ),
          };
        });
        setRows(updatedData);
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);

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
                  Branch
                </MDTypography>
                <MDTypography
                  variant="h6"
                  component={Link}
                  to="/branch/add"
                  borderRadius="lg"
                  color="white"
                  textAlign="end"
                >
                  <Icon fontSize="large">add</Icon>
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={false}
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

export default Branch;
