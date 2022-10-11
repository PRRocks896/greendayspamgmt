import { useEffect } from "react";
// react-router-dom components
import { useNavigate, useParams} from "react-router-dom";
// react-hook-form components
import { useForm, Controller, useFieldArray } from "react-hook-form";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { fetchByIdDailyReport, createUpdateDailyReport } from "service/dailyReport.service";
import { showToast } from "utils/helper";

function AddEditDailyReport() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const { handleSubmit, control, reset, getValues, setValue } = useForm({
        defaultValues: {
            dailyReportId: 0,
            dailyReportDate: new Date(),
            managerName: "",
            totalStaffPresent: "",
            totalCustomer: "",
            totalMemberGuest: "",
            openingBalance: "",
            cashSale: "",
            cardSale: "",
            upiPayment: "",
            dealsAppSale: "",
            expenseList: [
                {
                    // id: 0,
                    amount: 0,
                    description: ""
                }
            ],
            totalSales: "",
            tipsCard: "",
            totalCard: "",
            extraAddCash: "",
            totalCash: "",
            cashInCover: "",
            nextDayCash: "",
            salonCustomerCash: "",
            dailyReportFormName: "",
            userId: JSON.parse(localStorage.getItem("userData")).userId,
        }
    });

    const expenseListControls = useFieldArray({
        control: control,
        name: "expenseList"
    });

    const length = expenseListControls.fields.length;
    let totalExpense = 0;
    getValues("expenseList").forEach((res) => { 
        totalExpense += (parseInt(res.amount) || 0)
    });

    const handleCashInCover = () => {
        const subtract = parseInt(getValues("totalCash") || 0) - parseInt(getValues("nextDayCash") || 0);
        setValue("cashInCover", subtract);
    }

    const handleTotalCash = () => {
        let totalExpense = 0 ;
        getValues("expenseList").forEach((res) => { 
            totalExpense += (parseInt(res.amount) || 0)
        });
        const totalCash = ((parseInt(getValues("openingBalance")) || 0) + (parseInt(getValues("cashSale")) || 0));
        const sum = totalCash - totalExpense;
        setValue("totalCash", sum);
        handleCashInCover();
    }
    
    const handleTotalSales = () => {
        const sum = (parseInt(getValues("cashSale")) || 0) + 
                    (parseInt(getValues("cardSale")) || 0) + 
                    (parseInt(getValues("upiPayment")) || 0) +
                    (parseInt(getValues("dealsAppSale")) || 0)
        setValue("totalSales", sum);
    }

    useEffect(() => {
        if (id) {
            try {
                async function dailyReportById(id) {
                    const response = await fetchByIdDailyReport(id);
                    if (response.status === 200) {
                        reset(response.resultObject);
                    } else {
                        showToast(response.message);
                    }
                }
                dailyReportById(id);
            } catch(err) {
                showToast(err.message, false);
            }
        }
    }, [id, reset]);

    const addExpenseField = () => {
        expenseListControls.append({
            amount: "",
            description: ""
        });
    }

    const removeExpenseField = (id) => {
        expenseListControls.remove(id);
    }

    const handleSave = async (info) => {
        try {
            const response = await createUpdateDailyReport(info);
            if (response.status === 200) {
                showToast(response.message, true);
                navigate("/daily-report");
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
                                    Add Daily Report
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <MDBox component="form" role="form" padding="0px 20px">
                                    <MDBox display="grid" gridTemplateColumns="1fr 1fr">
                                        <MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="managerName"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Manager Name"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Manager Name",
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="totalStaffPresent"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Total Staff Present "
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Total Staff Present",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="totalCustomer"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Total Customer Visit"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Total Customer Visit",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="totalMemberGuest"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Total Member Guest"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Total Member Guest",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="openingBalance"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Opening Balance"
                                                            onChange={(e) => [onChange(e.target.value), handleTotalCash()]}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Opening Balance",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="cashSale"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Cash Sale"
                                                            onChange={(e) => [onChange(e.target.value), handleTotalSales(), handleTotalCash()]}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Cash Sale",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="cardSale"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Card Sale"
                                                            onChange={(e) => [onChange(e.target.value), handleTotalSales()]}
                                                            // onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Card Sale",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="upiPayment"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="UPI Payment"
                                                            onChange={(e) => [onChange(e.target.value), handleTotalSales()]}
                                                            // onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add UPI Payment",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="dealsAppSale"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Deals App Sale"
                                                            onChange={(e) => [onChange(e.target.value), handleTotalSales()]}
                                                            // onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Deals App Sale",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="totalSales"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Total Sales"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                            disabled
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Total Sales",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="tipsCard"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Tips Card"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Tips Card",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="totalCard"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Total Card"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Total Card",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="extraAddCash"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Extra Add Cash"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Extra Add Cash",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <MDInput
                                                    type="text"
                                                    value={totalExpense}
                                                    label="Total Expense"
                                                    fullWidth
                                                    disabled
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="totalCash"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Total Cash"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                            disabled
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Total Cash",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="nextDayCash"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Next Day Cash"
                                                            onChange={(e) => [onChange(e.target.value), handleCashInCover()]}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Next Day Cash",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="cashInCover"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Cash In Cover"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                            disabled
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Cash In Cover",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="salonCustomerCash"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Salon Customer Cash"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Salon Customer Cash",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="dailyReportFormName"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Daily Report Form Name"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Daily Report Form Name"
                                                    }}
                                                />
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <InputLabel style={{ paddingLeft: "18px" }}>Expense List</InputLabel>
                                            <br />
                                            <MDBox mb={2} style={{
                                                marginLeft: "20px",
                                            }}>
                                            {expenseListControls.fields?.map((res, index) => (
                                                <MDBox key={res.id} mb={2} style={{display: "grid", gridTemplateColumns: "1fr 14fr 1fr"}}>
                                                    <MDTypography
                                                        component="span"
                                                        onClick={() => addExpenseField()}
                                                        variant="caption"
                                                        color="text"
                                                        fontWeight="medium"
                                                        style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center" }}
                                                    >
                                                        {length === (index + 1) &&
                                                            <Icon fontSize="medium">add</Icon>
                                                        }
                                                    </MDTypography>
                                                    <MDBox display="flex">
                                                        <Controller
                                                            name={`expenseList.${index}.description`}
                                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                                // eslint-disable-next-line
                                                                <MDInput
                                                                    type="text"
                                                                    value={value}
                                                                    label="Description"
                                                                    onChange={onChange}
                                                                    error={!!error}
                                                                    helperText={error?.message ? error.message : ""}
                                                                    fullWidth
                                                                />
                                                            )}
                                                            control={control}
                                                            rules={{
                                                                required: "Please Add Description",
                                                            }}
                                                        />
                                                        <Controller
                                                            name={`expenseList.${index}.amount`}
                                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                                // eslint-disable-next-line
                                                                <MDInput
                                                                    style={{paddingLeft: "8px"}}
                                                                    type="text"
                                                                    value={value}
                                                                    label="Amount"
                                                                    onChange={(e) => [onChange(e.target.value), handleTotalCash()]}
                                                                    error={!!error}
                                                                    helperText={error?.message ? error.message : ""}
                                                                />
                                                            )}
                                                            control={control}
                                                            rules={{
                                                                required: "Please Add Amount",
                                                                pattern: {
                                                                    value: /^[0-9]/,
                                                                    message: "Enter only digit",
                                                                },
                                                            }}
                                                        />
                                                    </MDBox>
                                                    {length !== (index + 1) &&
                                                    <MDTypography
                                                        component="span"
                                                        onClick={() => removeExpenseField(index)}
                                                        // onClick={() => navigate(`/membershipmgmt/edit/${data.membershipManagementId}`)}
                                                        variant="caption"
                                                        color="text"
                                                        fontWeight="medium"
                                                        style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center" }}
                                                    >
                                                        <Icon fontSize="medium">remove</Icon>
                                                    </MDTypography>
                                                    }
                                                </MDBox>
                                            ))}
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                    <MDBox mt={4} mb={1} style={{ display: "flex" }}>
                                        <MDButton
                                            component="button"
                                            variant="gradient"
                                            color="info"
                                            onClick={() => navigate("/daily-report")}
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
    );
}

export default AddEditDailyReport;
