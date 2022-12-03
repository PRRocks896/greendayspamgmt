import { useCallback, useState, useEffect} from "react";
// react-hook-form components
import { useForm, Controller } from "react-hook-form";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { fetchCityList } from "service/city.service";
import { fetchBranchList } from "service/branch.service";
import { fetchEmployee } from "service/employee.service";
import { fetchEmployeeReport } from "service/report.service";
import { months, year } from "utils/constant";
import { showToast, isAdmin, getUserData } from "utils/helper";

function EmployeeReport() {
    const [cityList, setCityList] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [showReport, setShowReport] = useState(false);
    const [reportData, setReportData] = useState(null);

    const { handleSubmit, control } = useForm({
        defaultValues: {
            cityId: isAdmin() ? null : getUserData().cityId,
            branchId: isAdmin() ? null : getUserData().userId,
            employeeId: null,
            month: (new Date().getMonth() + 1),
            year: new Date().getFullYear()
        },
    });

    useEffect(() => {
        try {
            async function fetchCity() {
                const resCity = await fetchCityList();
                if(resCity.status === 200) {
                    setCityList(resCity.resultObject);
                } else {
                    setCityList([]);
                    showToast(resCity.message, false);
                }
            }
            fetchCity();
        } catch (err) {
            console.error(err);
            showToast(err.message, false);
        }
    }, []);

    const fetchBranchViaCityID = useCallback(async (cityId) => {
        try {
            const resBranch = await fetchBranchList({
                cityId: cityId,
                searchText: "",
                isActive: true,
                page: 0,
                size: 0,
            });
            if (resBranch.status === 200) {
                setBranchList(resBranch.resultObject?.data);
            } else {
                setBranchList([]);
                showToast(resBranch.message, false);
            }
        } catch(err) {
            console.error(err);
            showToast(err.message, false);
        }
    }, [setBranchList]);

    const fetchEmployeeViaBranchID = useCallback(async (branchId) => {
        try {
            const response = await fetchEmployee({
                searchText: "",
                isActive: true,
                page: 0,
                size: 0,
                branchId: branchId
            });
            console.log(response);
            if(response.status === 200) {
                setEmployeeList(response?.resultObject?.data);
            } else {
                showToast(response.message, false);
            }
        } catch(err) {
            console.error(err);
            showToast(err.message, false);
        }
    }, [setEmployeeList]);

    const handleDownloadPDF = async (info) => {
        setReportData(null);
        try {
            const response = await fetchEmployeeReport(info);
            if(response) {
                setReportData(response);
            }
        } catch(err) {
            showToast(err.message, false);
        } finally {
            setShowReport(true);
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
                                    Employee Report
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <MDBox component="form" role="form" padding="0px 20px">
                                    <MDBox
                                        display="grid"
                                        gridTemplateColumns="0.5fr 0.5fr 0.5fr 0.5fr 1fr"
                                    >
                                        <MDBox mb={2}>
                                            <Controller
                                                name="cityId"
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
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
                                                                <MenuItem
                                                                    key={`city_list_${index}`}
                                                                    onClick={() =>
                                                                        fetchBranchViaCityID(city.value)
                                                                    }
                                                                    value={city.value}
                                                                >
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
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="selectBranch">
                                                            Select Branch
                                                        </InputLabel>
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
                                                                <MenuItem
                                                                    key={`branch_list_${index}`}
                                                                    value={branch.branchId}
                                                                    onClick={() =>
                                                                        fetchEmployeeViaBranchID(branch.branchId)
                                                                    }
                                                                >
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
                                                name="employeeId"
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="selectEmployee">
                                                            Select Employee
                                                        </InputLabel>
                                                        <Select
                                                            style={{ padding: "10px 0px" }}
                                                            labelId="selectEmployee"
                                                            label="Select Employee"
                                                            value={value}
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                        >
                                                            {employeeList?.map((employee, index) => (
                                                                <MenuItem
                                                                    key={`employee_list_${index}`}
                                                                    value={employee.employeeId}
                                                                >
                                                                    {employee.firstName} ({employee.mobileNumber})
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                                control={control}
                                                rules={{
                                                    required: "Please select Employee",
                                                }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2} pl={1}>
                                            <Controller
                                                name="month"
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="selectMonth">
                                                            Select Month
                                                        </InputLabel>
                                                        <Select
                                                            style={{ padding: "10px 0px" }}
                                                            labelId="selectMonth"
                                                            label="Select Month"
                                                            value={value}
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                        >
                                                            {months?.map((month, index) => (
                                                                <MenuItem
                                                                    key={`month_list_${index}`}
                                                                    value={month}
                                                                >
                                                                    {month}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                                control={control}
                                                rules={{
                                                    required: "Please select Month",
                                                }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2} pl={1}>
                                            <Controller
                                                name="year"
                                                render={({
                                                    field: { onChange, value },
                                                    fieldState: { error },
                                                }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="selectYear">
                                                            Select Year
                                                        </InputLabel>
                                                        <Select
                                                            style={{ padding: "10px 0px" }}
                                                            labelId="selectYear"
                                                            label="Select Year"
                                                            value={value}
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                        >
                                                            {year?.map((yr, index) => (
                                                                <MenuItem
                                                                    key={`year_list_${index}`}
                                                                    value={yr}
                                                                >
                                                                    {yr}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                                control={control}
                                                rules={{
                                                    required: "Please select Month",
                                                }}
                                            />
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
                                    {(showReport && reportData === null) ?
                                        <MDBox mb={2}>
                                            <h3>No Record Found</h3>
                                        </MDBox>
                                    :
                                        null
                                    }  
                                    {(showReport && reportData !== null) ? 
                                        <iframe src={reportData} width="100%" style={{height: 'calc(100vh - 100px)'}} title="reportData"></iframe>
                                    : 
                                        null
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

export default EmployeeReport;