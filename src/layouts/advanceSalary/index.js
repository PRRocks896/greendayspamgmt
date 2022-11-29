import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as m from "moment";

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

import {
    fetchAdvanceSalaryList
} from "service/advanceSalary.service";

import { showToast } from "utils/helper";

function AdvanceSalary() {
    const [rows, setRows] = useState([]);
    const columns = [
        { Header: "srno", accessor: "index", align: "left" },
        { Header: "employee name", accessor: "employeeName", align: "left"},
        { Header: "salary", accessor: "salary", align: "left" },
        { Header: "Salary Given Date", accessor: "salaryGivenDate", align: "left"}
    ];

    useEffect(() => {
        try {
            async function advanceSalary() {
                const res = await fetchAdvanceSalaryList({
                    searchText: "",
                    // isActive: true,
                    page: 0,
                    size: 1000
                });
                if(res.status === 200 && res.resultObject?.data?.length > 0) {
                    setRows(res.resultObject?.data);
                }
            }
            advanceSalary();
        } catch(err) {
            showToast(err.message, false);
        }
    }, [setRows])

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
                    Advance Salary
                </MDTypography>
                <MDTypography
                  variant="h6"
                  component={Link}
                  to="/advanceSalary/add"
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
                      index: (index+1),
                      salaryGivenDate: m(data.salaryGivenDate).format('DD/MM/yyyy')
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

export default AdvanceSalary;
