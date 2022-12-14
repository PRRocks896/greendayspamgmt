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

import { Link } from "react-router-dom";

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

import { useBranch } from "./useBranch.hook";

function Branch() {
  const { rows, columns, navigate, handleDelete, handleChangeStatus } = useBranch();

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
                  table={{ columns, rows: rows?.map((data, index) => {
                    return {
                      ...data,
                      branchId: (index + 1),
                      isActive: (
                        <Switch checked={data?.isActive} onChange={(e) => handleChangeStatus(e.target.checked, data.branchId)} />
                      ),
                      action: (
                        <>
                        <MDTypography
                          component="span"
                          onClick={() => navigate(`/branch/edit/${data.branchId}`)}
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          style={{ cursor: "pointer" }}
                        >
                          <Icon fontSize="medium">edit</Icon>
                        </MDTypography>
                        <MDTypography
                          component="span"
                          onClick={() => handleDelete(data.branchId)}
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          style={{ cursor: "pointer" }}
                        >
                          <Icon fontSize="medium">delete</Icon>
                        </MDTypography>
                        </>
                      ),
                    };
                  }) }}
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

export default Branch;
