import { useCallback, useState } from "react";
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

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDDragdrop from "components/MDDragdrop";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { importExcelMembership } from "service/membership-mgmt.service";
import { importExcelMembershipRedeem } from "service/membership-redeem.service";
import { showToast } from "utils/helper";

function ImportExcel() {
    const [ file, setFile ] = useState(null);
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
          type: 1,
          excelFile: null
        },
    });

    const handleDropFile = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
        setValue('excelFile', acceptedFiles[0]);
    }, [setValue, setFile]);

    const handleImport = async (info) => {
        // console.log(info);
        try {
            let formData = new FormData();
            formData.append('excelFile', info.excelFile);
            if(info.type === 1) {
                const res = await importExcelMembership(formData);
                if(res) {
                    const a = document.createElement("a");
                    a.style.display = "none";
                    document.body.appendChild(a);
                    const blobFile = new Blob([res], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blobFile);
                    a.href = url;
                    a.download = 'duplicateMembershipRecords.csv'; 
                    a.click();
                    window.URL.revokeObjectURL(url);
                } else {
                    showToast('Added Successfully', true);
                }
            }
            if(info.type === 2) {
                const res = await importExcelMembershipRedeem(formData);
                if(res) {
                    const a = document.createElement("a");
                    a.style.display = "none";
                    document.body.appendChild(a);
                    const blobFile = new Blob([res], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blobFile);
                    a.href = url;
                    a.download = 'duplicateMembershipRedeemRecords.csv'; 
                    a.click();
                    window.URL.revokeObjectURL(url);
                } else {
                    showToast('Added Successfully', true);
                }
            }
        } catch(err) {
            console.error(err);
            showToast(err.message, false);
        } finally {
            setFile(null);
            reset();
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
                                    Import Excel
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <MDBox component="form" role="form" padding="0px 20px">
                                    <MDBox mb={2}>
                                        <Controller
                                            name="type"
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FormControl fullWidth>
                                                    <InputLabel id="selectType">Select Type</InputLabel>
                                                    <Select
                                                        style={{ padding: "10px 0px" }}
                                                        labelId="selectType"
                                                        label="Select Type"
                                                        value={value}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message ? error.message : ""}
                                                        disabled
                                                    >
                                                        <MenuItem value={1}>Membership Data</MenuItem>
                                                        {/* <MenuItem value={2}>Membership Redeem Data</MenuItem> */}
                                                    </Select>
                                                </FormControl>
                                            )}
                                            control={control}
                                            rules={{
                                                required: "Please select Type",
                                            }}
                                        />
                                    </MDBox>
                                    <MDBox mb={2}>
                                        {file === null ?
                                        <Controller
                                            name="excelFile"
                                            render={({ field: { value }, fieldState: { error } }) => (
                                                <MDBox style={{
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                    border: `1px solid ${error?.message ? 'red' : '#344767'}`,
                                                    borderRadius: "5px",
                                                    opacity: "0.3",
                                                }}>
                                                    <MDDragdrop
                                                        onDrop={handleDropFile} accept={".xlsx, .xls, .csv"}
                                                    />
                                                </MDBox>
                                            )}
                                            control={control}
                                            rules={{
                                                required: "Please Select File",
                                            }}
                                        />
                                        :
                                        <MDBox style={{
                                            display: 'flex'
                                        }}>
                                            <MDTypography variant="h3">
                                                {file?.name}
                                            </MDTypography>
                                            <Icon fontSize="large" style={{cursor: 'pointer'}} onClick={() => setFile(null)}> delete</Icon>
                                        </MDBox>
                                        }
                                    </MDBox>
                                    <MDBox mt={4} mb={1} style={{ display: "flex" }}>
                                        <MDButton
                                            component="button"
                                            variant="gradient"
                                            color="info"
                                            onClick={handleSubmit(handleImport)}
                                            fullWidth
                                        >
                                            Import
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}

export default ImportExcel;