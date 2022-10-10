// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// react-hook-form components
import { useForm, Controller } from "react-hook-form";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

import moment from "moment";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import DataTable from "examples/Tables/DataTable";

import { downloadDailyReport } from "service/dailyReport.service";
import { showToast } from "utils/helper";

function DailyReport() {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      userId: JSON.parse(localStorage.getItem("userData")).userId,
      fromDate: moment().format("yyyy-MM-DD"),
      toDate: moment().format("yyyy-MM-DD")
    }
  });

  const handleDownloadPDF = async (info) => {
    console.log(info);
    try {
      const response = await downloadDailyReport(info);
      console.log(response);
    } catch (err) {
      showToast(err.message, false);
    }
  }

  
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
                  Daily Report
                </MDTypography>
                <MDTypography
                  variant="h6"
                  component={Link}
                  to="/daily-report/add"
                  borderRadius="lg"
                  color="white"
                  textAlign="end"
                >
                  <Icon fontSize="large">add</Icon>
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
              <MDBox component="form" role="form" padding="0px 20px">
                <MDBox display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr">
                  <MDBox mb={2}>
                    <Controller
                      name="fromDate"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        // eslint-disable-next-line
                        <MDInput
                          type="date"
                          value={value}
                          label="From Date"
                          onChange={onChange}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          fullWidth
                        />
                      )}
                      control={control}
                      // rules={{
                      //   required: "Please Enter From Date",
                      // }}
                    />
                  </MDBox>
                  <MDBox mb={2} pl={1}>
                    <Controller
                      name="toDate"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        // eslint-disable-next-line
                        <MDInput
                          type="date"
                          value={value}
                          label="To Date"
                          onChange={onChange}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          fullWidth
                        />
                      )}
                      control={control}
                      // rules={{
                      //   required: "Please Enter From Date",
                      // }}
                    />
                  </MDBox>
                  <MDButton
                    style={{ marginLeft: "8px", marginBottom: "16px" }}
                    component="button"
                    variant="gradient"
                    color="info"
                    onClick={handleSubmit(handleDownloadPDF)}
                  >
                    Download Report
                  </MDButton>
                </MDBox>
                {/* <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                /> */}
              </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DailyReport;
