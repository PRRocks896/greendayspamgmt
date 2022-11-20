import { useCallback, useEffect, useState } from "react";
// react-router-dom components
import { useNavigate, useLocation } from "react-router-dom";
// react-hook-form components
import { useForm, Controller } from "react-hook-form";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDDragdrop from "components/MDDragdrop";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { 
    createMembershipMgmt, 
    fetchByIdMembershipMgmt, 
    sendOtp,
    verifyOtp
} from "service/membership-mgmt.service";
import { fetchCityList } from "service/city.service";
import { fetchBranchList } from "service/branch.service";
import { fetchMembershipPlanDropdown } from "service/membership.service";
import { fetchPaidModeDropDown } from "service/paid.service";
import { getFormData, showToast, isAdmin, getUserData } from "utils/helper";
import { endpoint } from "utils/constant";

function AddEditMembershipMgmt() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [id, setId] = useState(null);
    const [cityList, setCityList] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [membershipPlanList, setMembershipPlanList] = useState([]);
    const [paidMode, setPaidMode] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [otp, setOtp] = useState(null);
    const [isVerify, setIsVerify] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const { handleSubmit, control, reset, setValue, getValues } = useForm({
        defaultValues: {
            membershipManagementId: 0,
            customerName: "",
            phoneNumber: "",
            emailId: "",
            hours: 0,
            cityId: isAdmin() ? null : getUserData().cityId,
            branchId: isAdmin() ? null :  getUserData().userId,
            membershipPlanId: "",
            paidBy: "",
            managerName: "",
            billNo: "",
            customerPhoto: "",
            userId: getUserData().userId,
        },
    });

    useEffect(() => {
        try {
            async function getCityBranchMembershipPlanPaidMode() {
                const [resCity, resMembershipPlan, resPaidMode] = await Promise.all([
                    fetchCityList(),
                    fetchMembershipPlanDropdown(),
                    fetchPaidModeDropDown(),
                ]);
                setCityList(resCity.resultObject);
                setMembershipPlanList(resMembershipPlan.resultObject);
                setPaidMode(resPaidMode.resultObject);
            }
            getCityBranchMembershipPlanPaidMode();
        } catch (err) {
            console.error(err);
            showToast(err.message, false);
        }
    }, []);

    useEffect(() => {
        if (pathname.includes("edit")) {
            const splitData = pathname.split("/");
            if (splitData.length === 4) {
                setId(splitData[3]);
            }
        }
    }, [pathname]);

    useEffect(() => {
        if (id) {
            try {
                async function MembershipMgmtBtId(id) {
                    const response = await fetchByIdMembershipMgmt(id);
                    if (response.status === 200) {
                        reset(response.resultObject);
                        setSelectedImage(`${endpoint}/${response.resultObject?.customerPhotoPath}`);
                    } else {
                        showToast(response.message);
                    }
                }
                MembershipMgmtBtId(id);
            } catch (err) {
                showToast(err.message, false);
            }
        }
    }, [id, reset]);

    const sendOtpforExtraHours = async () => {
        try {
            const response = await sendOtp(JSON.parse(localStorage.getItem("userData")).userId, getValues().hours);
            if (response.status === 200) {
                setIsVerify(true);
                showToast(response.message, true);
            } else {
                setIsVerify(false);
                showToast(response.message, false);
            }
        } catch(err) {
            setIsVerify(false);
            showToast(err.message, false);
        }
    }

    const verifyOtpforExtraHours = async () => {
        try {
            const response = await verifyOtp(JSON.parse(localStorage.getItem("userData")).userId, otp);
            if (response.status === 200) {
                setIsVerify(false);
                setIsVerified(true);
                setDisableBtn(false);
                showToast(response.message, true);
            } else {
                setIsVerify(true);
                setIsVerified(false);
                showToast(response.message, false);
            }
        } catch(err) {
            setIsVerify(true);
            setIsVerified(false);
            showToast(err.message, false);
        }
    }

    //use for images manually upload and drop
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
            setValue("customerPhoto", file);
            const reader = new FileReader();
            reader.onload = function (e) {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
            return file;
        });
    }, [setValue]);

    const handleSave = async (info) => {
        try {
            const response = await createMembershipMgmt(getFormData(info));
            if (response.status === 200) {
                showToast(response.message, true);
                navigate("/membershipmgmt");
            } else {
                showToast(response.message, false);
            }
        } catch (err) {
            console.log(err);
            showToast(err.message, false);
        }
    };

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
                                    Add Membership Mgmt
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <MDBox component="form" role="form" padding="0px 20px">
                                    <MDBox display="grid" gridTemplateColumns="2fr 1fr">
                                        <MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="customerName"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Customer Name"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Customer Name",
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="phoneNumber"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Phone Number"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add phone number",
                                                        minLength: {
                                                            value: 10,
                                                            message: "Cannot be smaller than 10 characters",
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: "Cannot be longer than 10 characters",
                                                        },
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="emailId"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Email Address"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please enter Email",
                                                        pattern: {
                                                            // eslint-disable-next-line
                                                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                                            message: "Enter valid Email",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
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
                                                    name="branchId"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel id="selectBrnach">Select Branch</InputLabel>
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
                                            : null
                                            }
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="membershipPlanId"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel id="selectMembershipPlan">Select Membership Plan</InputLabel>
                                                            <Select
                                                                style={{ padding: "10px 0px" }}
                                                                labelId="selectMembershipPlan"
                                                                id="membership-plan"
                                                                label="Select Membership Plan"
                                                                value={value}
                                                                onChange={onChange}
                                                                error={!!error}
                                                                helperText={error?.message ? error.message : ""}
                                                                fullWidth
                                                            >
                                                                {membershipPlanList?.map((membershipPlan, index) => (
                                                                    <MenuItem
                                                                        key={`membership_plan_list_${index}`}
                                                                        value={membershipPlan.membershipPlanId}
                                                                    >
                                                                        {membershipPlan.fullPlanName}
                                                                        {/* {membershipPlan.planName} ({membershipPlan.hours} Hr) */}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please select Membership Plan",
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                name="hours"
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <MDBox display="flex">
                                                        <MDTypography
                                                            component="span"
                                                            onClick={() => {
                                                                setValue("hours", (parseInt(value) + 1))
                                                                if((parseInt(value) + 1) !== 0){
                                                                    setDisableBtn(true);
                                                                    setIsVerified(false);
                                                                }
                                                            }}
                                                            variant="caption"
                                                            color="text"
                                                            fontWeight="medium"
                                                            style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center" }}
                                                        >
                                                          <Icon fontSize="medium">add</Icon>
                                                        </MDTypography>
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Extra Hours"
                                                            onChange={onChange}
                                                            disabled
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                        />
                                                        <MDTypography
                                                            component="span"
                                                            onClick={() => {
                                                                if(parseInt(value) !== 0) {
                                                                    setValue("hours", (parseInt(value) - 1))
                                                                } else {
                                                                    setIsVerified(false);
                                                                }
                                                                if(parseInt(getValues("hours")) === 0) {
                                                                    setDisableBtn(false);
                                                                }
                                                            }}
                                                            // onClick={() => navigate(`/membershipmgmt/edit/${data.membershipManagementId}`)}
                                                            variant="caption"
                                                            color="text"
                                                            fontWeight="medium"
                                                            style={{ padding: "0px 5px", cursor: "pointer", alignSelf: "center" }}
                                                        >
                                                          <Icon fontSize="medium">remove</Icon>
                                                        </MDTypography>
                                                        {!isVerified &&
                                                        <MDBox>
                                                        {(parseInt(getValues().hours) > 0 && !isVerify) &&
                                                            <MDBox>
                                                                <MDButton
                                                                    component="button"
                                                                    variant="gradient"
                                                                    color="info"
                                                                    onClick={() => sendOtpforExtraHours()}
                                                                >
                                                                    Get Verify
                                                                </MDButton>
                                                            </MDBox>
                                                        }
                                                        {isVerify &&
                                                            <MDBox display="flex">
                                                                <MDInput
                                                                    type="text"
                                                                    value={otp}
                                                                    label="Enter OTP"
                                                                    onChange={(e) => setOtp(e.target.value)}
                                                                />
                                                                <MDButton
                                                                    component="button"
                                                                    variant="gradient"
                                                                    color="info"
                                                                    onClick={() => verifyOtpforExtraHours()}
                                                                >
                                                                    Verify OTP
                                                                </MDButton>
                                                            </MDBox>
                                                        }
                                                        </MDBox>
                                                        }
                                                    </MDBox>
                                                )}
                                                control={control}
                                                rules={{
                                                    required: "Please Enter Hours",
                                                    pattern: {
                                                    value: /^[0-9]/,
                                                    message: "Enter only digit",
                                                    }
                                                }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="paidBy"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel id="selectPaid">Select Paid By</InputLabel>
                                                            <Select
                                                                style={{ padding: "10px 0px" }}
                                                                labelId="selectPaid"
                                                                id="paid-select"
                                                                label="Select Paid By"
                                                                value={value}
                                                                onChange={onChange}
                                                                error={!!error}
                                                                helperText={error?.message ? error.message : ""}
                                                            >
                                                                {paidMode?.map((membershipPlan, index) => (
                                                                    <MenuItem key={`paid_list_${index}`} value={membershipPlan.value}>
                                                                        {membershipPlan.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please select Paid By",
                                                    }}
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
                                                    name="billNo"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        // eslint-disable-next-line
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Bill Number"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Bill Number",
                                                    }}
                                                />
                                            </MDBox>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <InputLabel style={{ paddingLeft: "18px" }}>Upload Customer Photo</InputLabel>
                                            <br />
                                            <MDBox mb={2} style={{
                                                marginLeft: "20px",
                                            }}>
                                                {selectedImage === null ?
                                                    <Controller
                                                        name="customerPhoto"
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <MDBox style={{
                                                                textAlign: "center",
                                                                cursor: "pointer",
                                                                border: "1px solid #344767",
                                                                borderRadius: "5px",
                                                                opacity: "0.3",
                                                            }}>
                                                                <MDDragdrop
                                                                    onDrop={onDrop} accept={"image/*"}
                                                                />
                                                            </MDBox>
                                                        )}
                                                        control={control}
                                                        rules={{
                                                            required: "Please add Customer Photo",
                                                        }}
                                                    />
                                                    :
                                                    <MDBox style={{
                                                        border: "1px solid #344767",
                                                        borderRadius: "5px",
                                                        display: "flex",
                                                        flexDirection: "row-reverse",
                                                        cursor: "pointer",
                                                    }}>
                                                        {id === null &&
                                                            <Icon fontSize="large" onClick={() => setSelectedImage(null)}> delete</Icon>}
                                                        <img style={{ height: "calc(100vh - 100px)" }} src={selectedImage} alt="customer" />
                                                    </MDBox>
                                                }
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                    <MDBox mt={4} mb={1} style={{ display: "flex" }}>
                                        <MDButton
                                            component="button"
                                            variant="gradient"
                                            color="info"
                                            onClick={() => navigate("/membershipplan")}
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
                                            disabled={disableBtn}
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

export default AddEditMembershipMgmt;
