import { useCallback, useEffect, useState } from "react";
// react-router-dom components
import { useNavigate, useParams} from "react-router-dom";
// react-hook-form components
import { useForm, Controller, useFieldArray } from "react-hook-form";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
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

import { fetchByIdDailyReport, createUpdateDailyReport } from "service/dailyReport.service";
import { fetchCityList } from "service/city.service";
import { fetchBranchList } from "service/branch.service";
import { showToast, isAdmin, getUserData } from "utils/helper";
import moment from "moment";

function AddEditDailyReport() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [cityList, setCityList] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const { handleSubmit, control, reset, getValues, setValue } = useForm({
        defaultValues: {
            cityId: null,
            dailyReportId: 0,
            dailyReportDate: moment().format("yyyy-MM-DD"), //new Date(),
            managerName: "",
            totalStaffPresent: "",
            totalCustomer: "",
            totalMemberGuest: "",
            openingBalance: "",
            cashSale: "",
            cardSale: "",
            upiPayment: "",
            dealsAppSale: "",
            cashInCoverDetail: {
                twoThousand: 0,
                fiveHundred: 0,
                twoHundred: 0,
                oneHundred: 0,
                fifty: 0,
            },
            expenseList: [
                {
                    amount: 0,
                    description: ""
                }
            ],
            totalSales: "",
            tipsCard: "",
            totalCard: "",
            totalCash: "",
            cashInCover: "",
            nextDayCash: "",
            salonCustomerCash: "",
            userId: isAdmin() ? null : getUserData().userId,
        }
    });

    const expenseListControls = useFieldArray({
        control: control,
        name: "expenseList"
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

    const cashCounts = Object.entries(getValues("cashInCoverDetail")).map(([key, value]) => ({key,value}));

    useEffect(() => {
        let sum = 0;
        cashCounts.forEach(res => {
            switch(res.key) {
                case "twoThousand": 
                    sum = sum + (2000 * parseInt(res.value));
                    break;
                case "fiveHundred": 
                    sum = sum + (500 * parseInt(res.value));
                    break;
                case "twoHundred": 
                    sum = sum + (200 * parseInt(res.value));
                    break;
                case "oneHundred": 
                    sum = sum + (100 * parseInt(res.value));
                    break;
                case "fifty": 
                    sum = sum + (50 * parseInt(res.value));
                    break;
                default:
                    break;
            }
        });
        setValue("cashInCover", sum);
    }, [cashCounts, setValue]);

    const length = expenseListControls.fields.length;
    let totalCashSalePlusOpeningBalance = 0;

    totalCashSalePlusOpeningBalance = (parseInt(getValues("cashSale")) || 0) + (parseInt(getValues("openingBalance")) || 0);

    let totalExpense = 0;
    getValues("expenseList").forEach((res) => { 
        totalExpense += (parseInt(res.amount) || 0)
    });

    // const handleCashInCover = () => {
    //     const subtract = parseInt(getValues("totalCash") || 0) - parseInt(getValues("nextDayCash") || 0);
    //     setValue("cashInCover", subtract);
    // }

    const handleTotalCash = () => {
        let totalExpense = 0 ;
        getValues("expenseList").forEach((res) => { 
            totalExpense += (parseInt(res.amount) || 0)
        });
        const sum = totalCashSalePlusOpeningBalance - (totalExpense + (parseInt(getValues("nextDayCash")) || 0) + (parseInt(getValues("totalCard")) || 0));
        setValue("totalCash", sum);
        // setValue("cashInCover", sum);
        // handleCashInCover();
    }
    
    const handleTotalSales = () => {
        const sum = (parseInt(getValues("cashSale")) || 0) + 
                    (parseInt(getValues("cardSale")) || 0) + 
                    (parseInt(getValues("upiPayment")) || 0) +
                    (parseInt(getValues("dealsAppSale")) || 0)
        setValue("totalSales", sum);
    }

    const handleTotalCard = () => {
        const totalCard = (parseInt(getValues("tipsCard")) * 25) / 100;
        setValue("totalCard", totalCard)
        handleTotalCash();
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
        handleTotalCash();
    }

    const handleSave = async (info) => {
        let totalExpense = 0;
        getValues("expenseList").forEach((res) => { 
            totalExpense += (parseInt(res.amount) || 0)
        });
        if(isAdmin()) {
            delete info["branchId"];
            delete info["cityId"];
        }
        try {
            const response = await createUpdateDailyReport({
                ...info,
                totalExpenses: totalExpense
            });
            if (response.status === 200) {
                showToast(response.message, true);
                navigate("/daily-report");
            } else {
                showToast(response.title, false);
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
                                            {isAdmin() ?
                                                <>
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
                                                    <MDBox mb={2}>
                                                        <Controller
                                                        name="userId"
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
                                                </>
                                            : 
                                                null
                                            }
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="dailyReportDate"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="date"
                                                            value={value}
                                                            label="Daily Report Date"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    // rules={{
                                                    //     required: "Please Select Report Date",
                                                    // }}
                                                />
                                            </MDBox>
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
                                                            variant="outlined"
                                                            onChange={onChange}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
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
                                                <MDInput
                                                    type="text"
                                                    value={totalCashSalePlusOpeningBalance}
                                                    label="Total Cash Sale + Opening Balance"
                                                    fullWidth
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled
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
                                                            label="Tips Card Amount"
                                                            onChange={(e) => [onChange(e.target.value), handleTotalCard()]}
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
                                                            label="25% Paid to Therapist"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                            disabled
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
                                            {/* <MDBox mb={2}>
                                                <Controller
                                                    name="extraAddCash"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                                            </MDBox> */}
                                            
                                            <MDBox mb={2}>
                                                <MDInput
                                                    type="text"
                                                    value={totalExpense}
                                                    label="Total Expense"
                                                    fullWidth
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled
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
                                                            onChange={(e) => [onChange(e.target.value), handleTotalCash()]}
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
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
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
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
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
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <InputLabel style={{ paddingLeft: "18px" }}>Expense List</InputLabel>
                                            <br />
                                            <MDBox mb={2} style={{ marginLeft: "20px", maxHeight: "500px", overflowY: "scroll" }}>
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
                                            <br />
                                            <InputLabel style={{ paddingLeft: "18px" }}>Cash Detail</InputLabel>
                                            <br />
                                            <MDBox mb={2} style={{ marginLeft: "20px" }}>
                                                <MDBox mb={2} style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 2.5fr"}}>
                                                    {/* eslint-disable-next-line */}
                                                    <MDInput
                                                        type="text"
                                                        defaultValue="2000"
                                                        variant="outlined"
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth
                                                        disabled
                                                    />
                                                    <span style={{textAlign: "center"}}>X</span>
                                                    <Controller
                                                        name="cashInCoverDetail.twoThousand"
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <MDBox style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 1fr"}}>
                                                                {/* // eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    value={value}
                                                                    label="Qty"
                                                                    variant="outlined"
                                                                    onChange={onChange}
                                                                    error={!!error}
                                                                    helperText={error?.message ? error.message : ""}
                                                                    fullWidth
                                                                />
                                                                <span style={{textAlign: "center"}}>=</span>
                                                                {/* eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    variant="outlined"
                                                                    value={2000 * (parseInt(value) || 0)}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    fullWidth
                                                                    disabled
                                                                />
                                                            </MDBox>
                                                        )}
                                                        control={control}
                                                        rules={{
                                                            required: "Please add Quantity",
                                                            pattern: {
                                                                value: /^[0-9]/,
                                                                message: "Enter only digit",
                                                            },
                                                        }}
                                                    />
                                                    
                                                </MDBox>
                                                <MDBox mb={2} style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 2.5fr"}}>
                                                    {/* eslint-disable-next-line */}
                                                    <MDInput
                                                        type="text"
                                                        defaultValue="500"
                                                        variant="outlined"
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth
                                                        disabled
                                                    />
                                                    <span style={{textAlign: "center"}}>X</span>
                                                    <Controller
                                                        name="cashInCoverDetail.fiveHundred"
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <MDBox style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 1fr"}}>
                                                                {/* // eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    value={value}
                                                                    label="Qty"
                                                                    variant="outlined"
                                                                    onChange={onChange}
                                                                    error={!!error}
                                                                    helperText={error?.message ? error.message : ""}
                                                                    fullWidth
                                                                />
                                                                <span style={{textAlign: "center"}}>=</span>
                                                                {/* eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    variant="outlined"
                                                                    value={500 * (parseInt(value) || 0)}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    fullWidth
                                                                    disabled
                                                                />
                                                            </MDBox>
                                                        )}
                                                        control={control}
                                                        rules={{
                                                            required: "Please add Quantity",
                                                            pattern: {
                                                                value: /^[0-9]/,
                                                                message: "Enter only digit",
                                                            },
                                                        }}
                                                    />
                                                </MDBox>
                                                <MDBox mb={2} style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 2.5fr"}}>
                                                    {/* eslint-disable-next-line */}
                                                    <MDInput
                                                        type="text"
                                                        defaultValue="200"
                                                        variant="outlined"
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth
                                                        disabled
                                                    />
                                                    <span style={{textAlign: "center"}}>X</span>
                                                    <Controller
                                                        name="cashInCoverDetail.twoHundred"
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <MDBox style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 1fr"}}>
                                                                {/* // eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    value={value}
                                                                    label="Qty"
                                                                    variant="outlined"
                                                                    onChange={onChange}
                                                                    error={!!error}
                                                                    helperText={error?.message ? error.message : ""}
                                                                    fullWidth
                                                                />
                                                                <span style={{textAlign: "center"}}>=</span>
                                                                {/* eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    variant="outlined"
                                                                    value={200 * (parseInt(value) || 0)}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    fullWidth
                                                                    disabled
                                                                />
                                                            </MDBox>
                                                        )}
                                                        control={control}
                                                        rules={{
                                                            required: "Please add Quantity",
                                                            pattern: {
                                                                value: /^[0-9]/,
                                                                message: "Enter only digit",
                                                            },
                                                        }}
                                                    />
                                                </MDBox>
                                                <MDBox mb={2} style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 2.5fr"}}>
                                                    {/* eslint-disable-next-line */}
                                                    <MDInput
                                                        type="text"
                                                        defaultValue="100"
                                                        variant="outlined"
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth
                                                        disabled
                                                    />
                                                    <span style={{textAlign: "center"}}>X</span>
                                                    <Controller
                                                        name="cashInCoverDetail.oneHundred"
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <MDBox style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 1fr"}}>
                                                                {/* // eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    value={value}
                                                                    label="Qty"
                                                                    variant="outlined"
                                                                    onChange={onChange}
                                                                    error={!!error}
                                                                    helperText={error?.message ? error.message : ""}
                                                                    fullWidth
                                                                />
                                                                <span style={{textAlign: "center"}}>=</span>
                                                                {/* eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    variant="outlined"
                                                                    value={100 * (parseInt(value) || 0)}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    fullWidth
                                                                    disabled
                                                                />
                                                            </MDBox>
                                                        )}
                                                        control={control}
                                                        rules={{
                                                            required: "Please add Quantity",
                                                            pattern: {
                                                                value: /^[0-9]/,
                                                                message: "Enter only digit",
                                                            },
                                                        }}
                                                    />
                                                </MDBox>
                                                <MDBox mb={2} style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 2.5fr"}}>
                                                    {/* eslint-disable-next-line */}
                                                    <MDInput
                                                        type="text"
                                                        defaultValue="50"
                                                        variant="outlined"
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth
                                                        disabled
                                                    />
                                                    <span style={{textAlign: "center"}}>X</span>
                                                    <Controller
                                                        name="cashInCoverDetail.fifty"
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <MDBox style={{display: "grid", gridTemplateColumns: "1fr 0.5fr 1fr"}}>
                                                                {/* // eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    value={value}
                                                                    label="Qty"
                                                                    variant="outlined"
                                                                    onChange={onChange}
                                                                    error={!!error}
                                                                    helperText={error?.message ? error.message : ""}
                                                                    fullWidth
                                                                />
                                                                <span style={{textAlign: "center"}}>=</span>
                                                                {/* eslint-disable-next-line */}
                                                                <MDInput
                                                                    type="text"
                                                                    variant="outlined"
                                                                    value={50 * (parseInt(value) || 0)}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    fullWidth
                                                                    disabled
                                                                />
                                                            </MDBox>
                                                        )}
                                                        control={control}
                                                        rules={{
                                                            required: "Please add Quantity",
                                                            pattern: {
                                                                value: /^[0-9]/,
                                                                message: "Enter only digit",
                                                            },
                                                        }}
                                                    />
                                                </MDBox>
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
