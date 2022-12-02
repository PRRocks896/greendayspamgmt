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
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDDragdrop from "components/MDDragdrop";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { createEmployee, updateEmployee, fetchByIdEmployee } from "service/employee.service";
import { fetchCityList } from "service/city.service";
import { fetchBranchList } from "service/branch.service";
import { fetchEmployeeTypeDropDown } from "service/employeeType.service";
import { getFormData, showToast, isAdmin, getUserData } from "utils/helper";
import { endpoint } from "utils/constant";

// Images
import fingerDefult from "assets/images/svg/fingerprint.svg";
import fingerSuccess from "assets/images/svg/fingerprintsuccess.svg";
import fingerFail from "assets/images/svg/fingerprintfail.svg";

function AddEditEmployee() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [id, setId] = useState(null);
    const [employeeTypeList, setEmployeeList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [branchList, setBranchList] = useState([]);
    const [livePhoto, setLivePhoto] = useState(null);
    const [idProof, setIdProof] = useState(null);
    const [addressPhoto, setAddressPhoto] = useState(null);
    const [ fingerPrintScanned, setFingerPrintScanned ] = useState(false);
    const { handleSubmit, control, reset, setValue, getValues } = useForm({
        defaultValues: {
            employeeId: 0,
            firstName: "",
            mobileNumber: "",
            fatherName: "",
            fatherMobileNumber: "",
            employeeTypeId: null,
            cityId: isAdmin() ? null : getUserData().cityId ,
            branchId: isAdmin() ? null :  getUserData().userId,
            livePhoto: "",
            salary: null,
            idProof: "",
            addressPhoto: "",
            touchId: "",
            isActive: true,
            userId: getUserData().userId,
        },
    });

    useEffect(() => {
        try {
            async function fetchCity() {
                const [resCity, resEmployeeType] = await Promise.all([fetchCityList(), fetchEmployeeTypeDropDown()])
                setCityList(resCity.resultObject);
                setEmployeeList(resEmployeeType.resultObject);
                // setBranchList(resBranch.resultObject);
            }
            fetchCity();
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
                async function employeeByID(id) {
                    const response = await fetchByIdEmployee(id);
                    if (response.status === 200) {
                        reset(response.resultObject);
                        setLivePhoto(`${endpoint}/${response.resultObject?.livePhotoPath}`);
                        setIdProof(`${endpoint}/${response.resultObject?.idProofPath}`);
                        setAddressPhoto(`${endpoint}/${response.resultObject?.addressProofPath}`);
                    } else {
                        showToast(response.message, false);
                    }
                }
                employeeByID(id);
            } catch (err) {
                showToast(err.message, false);
            }
        }
    }, [id, reset]);

    //use for images manually upload and drop
    const onDropLivePhoto = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
            setValue("livePhoto", file);
            // setValue("customerPhoto", file);
            const reader = new FileReader();
            reader.onload = function (e) {
                setLivePhoto(e.target.result);
            };
            reader.readAsDataURL(file);
            return file;
        });
    }, [setValue, setLivePhoto]);

    const onDropIdProof = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
            setValue("idProof", file);
            const reader = new FileReader();
            reader.onload = function (e) {
                setIdProof(e.target.result);
            };
            reader.readAsDataURL(file);
            return file;
        });
    }, [setValue, setIdProof]);

    const onDropAddressPhoto = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
            setValue("addressPhoto", file);
            const reader = new FileReader();
            reader.onload = function (e) {
                setAddressPhoto(e.target.result);
            };
            reader.readAsDataURL(file);
            return file;
        });
    }, [setValue, setAddressPhoto]);

    const handleTouchId = () => {
        try {
            const isAtteched = window["GetMFS100Info"]();
            if(isAtteched.httpStaus && isAtteched.data.ErrorCode === "0") {
                setFingerPrintScanned(false);
                setValue("touchId", "");
                const res = window["CaptureFinger"](70, 10);
                if (res.httpStaus) {
                    if (res.data.ErrorCode === "0") {
                        setFingerPrintScanned(true);
                        setValue("touchId", res.data.IsoTemplate);
                    } else {
                        setFingerPrintScanned(false);
                        setValue("touchId", "");
                        showToast(res.data.ErrorDescription, false)
                    }
                } else {
                    setFingerPrintScanned(false);
                    setValue("touchId", "");
                    showToast(res.err, false);
                }
            } else {
                showToast("Finger Scanner Not Attached", false);
            }
        } catch(err) {
            console.error(err);
            showToast(err.message, false);
        }
    }
    
    const handleSave = async (info) => {
        try {
            if(id === null) {
                const response = await createEmployee(getFormData(info));
                if (response.status === 200) {
                    showToast(response.message, true);
                    navigate("/employee");
                } else {
                    showToast(response.message, false);
                }
            } else {
                const response = await updateEmployee(getFormData({...info, addressPhoto: info?.addressProofPath}));
                if (response.status === 200) {
                    showToast(response.message, true);
                    navigate("/employee");
                } else {
                    showToast(response.message, false);
                }
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
                                    {id ? "Edit" : "Add"} Employee
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <MDBox component="form" role="form" padding="0px 20px">
                                    <MDBox mb={2}>
                                        <Controller
                                            name="employeeTypeId"
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FormControl fullWidth>
                                                    <InputLabel id="selectEmployeeType">Select Employee Type</InputLabel>
                                                    <Select
                                                        style={{ padding: "10px 0px" }}
                                                        labelId="selectEmployeeType"
                                                        id="Employee-type-select"
                                                        label="Select Employee Type"
                                                        value={value}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        helperText={error?.message ? error.message : ""}
                                                    >
                                                        {employeeTypeList?.map((type, index) => (
                                                            <MenuItem key={`employee_type_list_${index}`} value={type.value}>
                                                                {type.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )}
                                            control={control}
                                            rules={{
                                                required: "Please select Employee Type",
                                            }}
                                        />
                                    </MDBox>
                                    <MDBox display="grid" gridTemplateColumns="1fr 1fr">
                                        <MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="firstName"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Employee Name"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add First Name",
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="mobileNumber"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                                        </MDBox>
                                        <MDBox pl={2}>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="fatherName"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Father/Husband Name"
                                                            onChange={onChange}
                                                            error={!!error}
                                                            helperText={error?.message ? error.message : ""}
                                                            fullWidth
                                                        />
                                                    )}
                                                    control={control}
                                                    rules={{
                                                        required: "Please add Father/Husband Name",
                                                    }}
                                                />
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="fatherMobileNumber"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <MDInput
                                                            type="text"
                                                            value={value}
                                                            label="Father/Husband Phone Number"
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
                                        </MDBox>
                                        {isAdmin() ?
                                            <MDBox>
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
                                            </MDBox>
                                        : null }
                                        <MDBox pl={isAdmin() ? 2 : 0}>
                                            <MDBox mb={2}>
                                                <Controller
                                                    name="salary"
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                                                        required: "Please add Salary",
                                                        pattern: {
                                                            value: /^[0-9]/,
                                                            message: "Enter only digit",
                                                        },
                                                    }}
                                                />
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                    <MDBox mb={2} display="grid" gridTemplateColumns="1fr 1fr" style={{gridGap: "20px"}}>
                                        <MDBox>
                                            <InputLabel>Upload Employee Photo</InputLabel>
                                            <br />
                                            <MDBox mb={2}>
                                                {livePhoto === null ?
                                                    <Controller
                                                        name="livePhoto"
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <MDBox style={{
                                                                textAlign: "center",
                                                                cursor: "pointer",
                                                                border: `1px solid ${error?.message ? 'red' : '#344767'}`,
                                                                borderRadius: "5px",
                                                                opacity: "0.3",
                                                            }}>
                                                                <MDDragdrop
                                                                    onDrop={onDropLivePhoto} accept={"image/*"}
                                                                />
                                                            </MDBox>
                                                        )}
                                                        control={control}
                                                        rules={{
                                                            required: "Please Employee Photo",
                                                        }}
                                                    />
                                                    :
                                                    <MDBox style={{
                                                        border: "1px solid #344767",
                                                        borderRadius: "5px",
                                                        display: "flex",
                                                        cursor: "pointer",
                                                    }}>
                                                        <img style={{ width: "250px", height: "auto" }} src={livePhoto} alt="customer" />
                                                        {id === null &&
                                                            <Icon fontSize="large" onClick={() => setLivePhoto(null)}> delete</Icon>}
                                                    </MDBox>
                                                }
                                            </MDBox>
                                        </MDBox>
                                        <MDBox>
                                            <InputLabel>Upload Employee ID Proof</InputLabel>
                                            <br />
                                            <MDBox mb={2}>
                                                {idProof === null ?
                                                    <Controller
                                                        name="idProof"
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <MDBox style={{
                                                                textAlign: "center",
                                                                cursor: "pointer",
                                                                border: `1px solid ${error?.message ? 'red' : '#344767'}`,
                                                                borderRadius: "5px",
                                                                opacity: "0.3",
                                                            }}>
                                                                <MDDragdrop
                                                                    onDrop={onDropIdProof} accept={"image/*"}
                                                                />
                                                            </MDBox>
                                                        )}
                                                        control={control}
                                                        rules={{
                                                            required: "Please Employee Id Proof",
                                                        }}
                                                    />
                                                    :
                                                    <MDBox style={{
                                                        border: "1px solid #344767",
                                                        borderRadius: "5px",
                                                        display: "flex",
                                                        cursor: "pointer",
                                                    }}>
                                                        <img style={{ width: "250px", height: "auto" }} src={idProof} alt="customer" />
                                                        {id === null &&
                                                            <Icon fontSize="large" onClick={() => setIdProof(null)}> delete</Icon>}
                                                    </MDBox>
                                                }
                                            </MDBox>
                                        </MDBox>
                                        <MDBox>
                                            <InputLabel>Upload Employee Address Proof</InputLabel>
                                            <br />
                                            <MDBox mb={2}>
                                                {addressPhoto === null ?
                                                    <Controller
                                                        name="addressPhoto"
                                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                            <MDBox style={{
                                                                textAlign: "center",
                                                                cursor: "pointer",
                                                                border: `1px solid ${error?.message ? 'red' : '#344767'}`,
                                                                borderRadius: "5px",
                                                                opacity: "0.3",
                                                            }}>
                                                                <MDDragdrop
                                                                    onDrop={onDropAddressPhoto} accept={"image/*"}
                                                                />
                                                            </MDBox>
                                                        )}
                                                        control={control}
                                                        rules={{
                                                            required: "Please Employee Address Photo",
                                                        }}
                                                    />
                                                    :
                                                    <MDBox style={{
                                                        border: "1px solid #344767",
                                                        borderRadius: "5px",
                                                        display: "flex",
                                                        // flexDirection: "row-reverse",
                                                        cursor: "pointer",
                                                    }}>
                                                        <img style={{width: "250px", height: "auto" }} src={addressPhoto} alt="customer" />
                                                        {id === null &&
                                                            <Icon fontSize="large" onClick={() => setAddressPhoto(null)}> delete</Icon>}
                                                    </MDBox>
                                                }
                                            </MDBox>
                                        </MDBox>
                                        <MDBox>
                                            <InputLabel>Upload Finger Print</InputLabel>
                                            <br />
                                            <MDBox mb={2}>
                                                <MDBox style={{cursor: 'pointer', paddingLeft: '150px'}} onClick={handleTouchId}>
                                                    {/* {(getValues("touchId") === "") ?
                                                        <MDAvatar src={fingerDefult} size="xxl"/>
                                                    : } */}
                                                    {(getValues("touchId") !== "" && fingerPrintScanned) ?
                                                        <MDAvatar src={fingerSuccess} size="xxl"/>
                                                    : (getValues("touchId") !== "" && !fingerPrintScanned) ?
                                                        <MDAvatar src={fingerFail} size="xxl"/>
                                                    : <MDAvatar src={fingerDefult} size="xxl"/>}
                                                    {/* <MDAvatar src={fingerDefult} size="xxl"/> */}
                                                    {/* <MDAvatar src={fingerSuccess} size="xxl"/> */}
                                                    {/* <MDAvatar src={fingerFail} size="xxl"/> */}
                                                </MDBox>
                                            </MDBox>
                                        </MDBox>
                                    </MDBox>
                                    <MDBox mt={4} mb={1} style={{ display: "flex" }}>
                                        <MDButton
                                            component="button"
                                            variant="gradient"
                                            color="info"
                                            onClick={() => navigate("/employee")}
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

export default AddEditEmployee;
