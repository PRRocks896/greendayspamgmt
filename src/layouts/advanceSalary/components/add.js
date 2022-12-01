import { useEffect, useState } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// react-hook-form components
import { useForm, Controller } from "react-hook-form";
import * as m from "moment";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { fetchEmployee } from "service/employee.service";
import { createAdvanceSalary } from "service/advanceSalary.service";
import { showToast, getUserData } from "utils/helper";

function AddAdvanceSalary() {
    const navigate = useNavigate();
    const [employeeList, setEmployeeList] = useState([]);

    const { handleSubmit, control } = useForm({
        defaultValues: {
            userId: getUserData().userId,
            employeeId: null,
            salary: null,
            salaryGivenDate: m().format("yyy-MM-DD")
        },
    });

    useEffect(() => {
        try {
            async function getEmployeeList() {
                const resEmployee = await fetchEmployee({
                    searchText: "",
                    isActive: true,
                    page: 0,
                    size: 1000,
                    branchId: getUserData().userId
                });
                if(resEmployee.status === 200) {
                    console.log(resEmployee?.resultObject?.data);
                    setEmployeeList(resEmployee?.resultObject?.data);
                }
            }
            getEmployeeList();
        } catch(err) {
            showToast(err.message, false);
        }
    }, []);

    const handleSave = async (info) => {
        try {
            const response = await createAdvanceSalary(info);
            if (response.status === 200) {
                showToast(response.message, true);
                navigate("/advanceSalary");
            } else {
                showToast(response.message, false);
            }
        } catch (err) {
            console.log(err);
            showToast(err.message, false);
        }
    };

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
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                    Add Advance Salary
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <MDBox component="form" role="form" padding="0px 20px">
                                    {/* display="grid" gridTemplateColumns="2fr 1fr" */}
                                    <MDBox>
                                        <MDBox mb={2}>
                                            <Controller
                                                name="employeeId"
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="selectEmployee">Select Employee</InputLabel>
                                                        <Select
                                                            style={{ padding: "10px 0px" }}
                                                            labelId="selectEmployee"
                                                            id="employee-select"
                                                            label="Select Employee"
                                                            value={value}
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                        >
                                                            {employeeList?.map((employee, index) => (
                                                                <MenuItem key={`employee_list_${index}`} value={employee.employeeId}>
                                                                    {employee.firstName}({employee.mobileNumber})
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
                                        <MDBox mb={2}>
                                            <Controller
                                                name="salary"
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    // eslint-disable-next-line
                                                    <MDInput
                                                        type="text"
                                                        value={value}
                                                        label="Salary"
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message ? error.message : ""}
                                                        fullWidth
                                                    />
                                                )}
                                                control={control}
                                                rules={{
                                                    required: "Please add salary",
                                                    pattern: {
                                                        value: /^[0-9]/,
                                                        message: "Enter only digit",
                                                    },
                                                }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <Controller
                                            name="salaryGivenDate"
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                // eslint-disable-next-line
                                                <MDInput
                                                type="date"
                                                value={value}
                                                label="Salary Given Date"
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message ? error.message : ""}
                                                fullWidth
                                                />
                                            )}
                                            control={control}
                                            rules={{
                                                required: "Please add Date",
                                            }}
                                            />
                                        </MDBox>
                                    </MDBox>
                                    <MDBox mt={4} mb={1} style={{ display: "flex" }}>
                                        <MDButton
                                            component="button"
                                            variant="gradient"
                                            color="info"
                                            onClick={() => navigate("/advanceSalary")}
                                            style={{ marginRight: "8px" }}
                                            fullWidth
                                        >
                                            Back
                                        </MDButton>
                                        <MDButton
                                            component="button"
                                            variant="gradient"
                                            color="info"
                                            onClick={handleSubmit(handleSave)}
                                            fullWidth
                                        >
                                            Save
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    )
}

export default AddAdvanceSalary;