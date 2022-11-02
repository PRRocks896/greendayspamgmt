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

import { fetchEmployee } from "service/employee.service";
import { statusChange, deleteRecord } from "service/user.service";
import { showToast, isAdmin, getUserData, confirmationBox } from "utils/helper";

function Employee() {
  const [rows, setRows] = useState([]);
  const columns = [
    { Header: "index", accessor: "index", width: "15%", align: "left" },
    { Header: "firstName", accessor: "firstName", align: "left" },
    { Header: "fatherName", accessor: "fatherName", align: "center" },
    { Header: "mobileNumber", accessor: "mobileNumber", align: "center" },
    { Header: "branchName", accessor: "branchName", align: "center" },
    { Header: "cityName", accessor: "cityName", align: "center" },
    { Header: "status", accessor: "isActive", align: "center"},
    { Header: "action", accessor: "action", align: "center" },
  ];

  const navigate = useNavigate();

  const handleChangeStatus = useCallback(async (value, id) => {
    const response = await statusChange({
      moduleName: "Employee",
      id,
      isActive: value
    });
    if(response.status === 200) {
      const response = await fetchEmployee(
        isAdmin() ? {
          searchText: "",
          // isActive: true,
          page: 0,
          size: 1000,
        } : {
          searchText: "",
          // isActive: true,
          page: 0,
          size: 1000,
          cityId: getUserData().cityId,
          branchId: getUserData().userId
        }
      );
      if (response.status === 200 && response.resultObject?.data?.length > 0) {  
        setRows(response.resultObject?.data);
      }
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    if(confirmationBox("Are You Sure...?")) {
      const response = await deleteRecord({
        moduleName: "Employee",
        id
      });
      if(response.status === 200) {
        const response = await fetchEmployee(
          isAdmin() ? {
            searchText: "",
            // isActive: true,
            page: 0,
            size: 1000,
          } : {
            searchText: "",
            // isActive: true,
            page: 0,
            size: 1000,
            cityId: getUserData().cityId,
            branchId: getUserData().userId
          }
        );
        if (response.status === 200 && response.resultObject?.data?.length > 0) {
          setRows(response.resultObject?.data);
        }
      }
    }
  }, []);

  useEffect(() => {
    try {
      async function getEmployee() {
        const response = await fetchEmployee(
          isAdmin() ? {
            searchText: "",
            // isActive: true,
            page: 0,
            size: 1000,
          } : {
            searchText: "",
            // isActive: true,
            page: 0,
            size: 1000,
            cityId: getUserData().cityId,
            branchId: getUserData().userId
          });
        if (response.status === 200 && response.resultObject?.data?.length > 0) {
          setRows(response.resultObject?.data);
        }
      }
      getEmployee();
    } catch (err) {
      showToast(err.message, false);
    }
    return () => false;
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
                  table={{ columns, rows: rows?.map((data, index) => {
                    return {
                      ...data,
                      index: (index + 1),
                      isActive: (
                        <Switch checked={data?.isActive} onChange={(e) => handleChangeStatus(e.target.checked, data.employeeId)} />
                      ),
                      action: (
                        <>
                        <MDTypography
                          component="span"
                          onClick={() => navigate(`/employee/edit/${data.employeeId}`)}
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          style={{ cursor: "pointer" }}
                        >
                          <Icon fontSize="medium">edit</Icon>
                        </MDTypography>
                        <MDTypography
                          component="span"
                          onClick={() => handleDelete(data.employeeId)}
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
