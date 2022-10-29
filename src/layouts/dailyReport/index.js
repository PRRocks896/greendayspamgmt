import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

// react-hook-form components
import { useForm, Controller } from "react-hook-form";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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

import { downloadDailyReport } from "service/dailyReport.service";
import { fetchCityList } from "service/city.service";
import { fetchBranchList } from "service/branch.service";
import { showToast } from "utils/helper";

function DailyReport() {
  const [cityList, setCityList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const { handleSubmit, control } = useForm({
    defaultValues: {
      cityId: "",
      branchId: "",
      date: moment().format("yyyy-MM-DD"),
    }
  });

  useEffect(() => {
    try {
      async function fetchCity() {
        const resCity = await fetchCityList();
        setCityList(resCity.resultObject);
      }
      fetchCity();
    } catch (err) {
      console.error(err);
      showToast(err.message, false);
    }
  }, []);

  const fetchBranchViaCityID = useCallback(async (cityId) => {
    const resBranch = await fetchBranchList({
      cityId: cityId,
      searchText: "",
      isActive: true,
      page: 0,
      size: 0
    });
    if(resBranch.status === 200) {
      setBranchList(resBranch.resultObject?.data);
    }
  }, [setBranchList]);

  const handleDownloadPDF = async (info) => {
    delete info["cityId"];
    setReportData(null);
    setShowReport(true);
    try {
      const response = await downloadDailyReport(info);
      if(response) {
        setReportData(response);
      }
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
                <MDBox display="grid" gridTemplateColumns="0.5fr 0.5fr 0.5fr 0.5fr 1fr">
                  <MDBox mb={2}>
                      <Controller
                          name="cityId"
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <FormControl fullWidth>
                              <InputLabel id="selectCity">Select City</InputLabel>
                              <Select
                                style={{ padding: "10px 0px" }}
                                labelId="selectCity"
                                id="city-select"
                                label="Select City"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error?.message ? error.message : ""}
                              >
                                  {cityList?.map((city, index) => (
                                    <MenuItem key={`city_list_${index}`} onClick={() => fetchBranchViaCityID(city.value)} value={city.value}>
                                        {city.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          )}
                          control={control}
                          rules={{
                            required: "Please select City",
                          }}
                      />
                  </MDBox>
                  <MDBox mb={2} pl={1}>
                    <Controller
                      name="branchId"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <FormControl fullWidth>
                              <InputLabel id="selectBranch">Select Branch</InputLabel>
                              <Select
                                  style={{ padding: "10px 0px" }}
                                  labelId="selectBranch"
                                  label="Select Branch"
                                  value={value}
                                  onChange={onChange}
                                  error={!!error}
                                  helperText={error?.message ? error.message : ""}
                              >
                                  {branchList?.map((branch, index) => (
                                      <MenuItem key={`branch_list_${index}`} value={branch.branchId}>
                                          {branch.branchName}
                                      </MenuItem>
                                  ))}
                              </Select>
                          </FormControl>
                      )}
                      control={control}
                      rules={{
                          required: "Please select Branch",
                      }}
                    />
                  </MDBox>
                  <MDBox mb={2} pl={1}>
                    <Controller
                      name="date"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        // eslint-disable-next-line
                        <MDInput
                          type="date"
                          value={value}
                          label="Date"
                          onChange={onChange}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          fullWidth
                        />
                      )}
                      control={control}
                    />
                  </MDBox>
                  <MDBox mb={2} pl={1}>
                  </MDBox>
                  <MDButton
                    style={{ marginLeft: "8px", marginBottom: "16px" }}
                    component="button"
                    variant="gradient"
                    color="info"
                    onClick={handleSubmit(handleDownloadPDF)}
                  >
                    View Report
                  </MDButton>
                </MDBox>
                {!showReport ? 
                  <MDBox mb={2}>
                  </MDBox>
                  : null
                }
                {(showReport && reportData === null) ?
                  <MDBox mb={2}>
                    <h3>No Record Found</h3>
                  </MDBox>
                  :
                  null
                }  
                {(showReport && reportData !== null) ? 
                  <iframe src={reportData} width="100%" style={{height: 'calc(100vh - 100px)'}} title="reportData"></iframe>
                  : null
                }
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
