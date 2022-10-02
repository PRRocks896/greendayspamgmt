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

import { fetchEmployee } from "service/employee.service";
import { showToast } from "utils/helper";

function Employee() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([
    { Header: "employeeId", accessor: "employeeId", width: "15%", align: "left" },
    { Header: "firstName", accessor: "firstName", align: "left" },
    { Header: "fatherName", accessor: "fatherName", align: "center" },
    { Header: "mobileNumber", accessor: "mobileNumber", align: "center" },
    { Header: "branchName", accessor: "branchName", align: "center" },
    { Header: "cityName", accessor: "cityName", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ]);

  const navigate = useNavigate();

  const jumpToEdit = (id) => {
    navigate(`/employee/edit/${id}`);
  };

  useEffect(async () => {
    try {
      const response = await fetchEmployee({
        searchText: "",
        isActive: true,
        page: 0,
        size: 1000,
      });
      if (response.status === 200 && response.resultObject?.data?.length > 0) {
        const updatedData = response.resultObject.data?.map((data, index) => {
          return {
            ...data,
            action: (
              <MDTypography
                component="span"
                onClick={() => jumpToEdit(data.employeeId)}
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
    } catch (err) {
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
                  Employees
                </MDTypography>
                <MDTypography
                  variant="h6"
                  component={Link}
                  to="/employee/add"
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

export default Employee;
