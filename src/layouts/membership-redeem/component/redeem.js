import { useCallback, useEffect, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-hook-form components
import { useForm, Controller } from "react-hook-form";

// @mui material components
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
import MDDragdrop from "components/MDDragdrop";

import { 
    createUpdateMembershipRedeem,
    getVerifyToRedeemMembership,
    verifyOtpForRedeemMembership
} from "service/membership-redeem.service";

import { getFormData, showToast } from "utils/helper";

function Redeem(props) {
    const { detail, customerDetail, closeRedeemForm, handleAfterRedeemSuccess } = props;
    const [selectedImage, setSelectedImage] = useState(null);
    const [sentOtp, setSentOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const { handleSubmit, control, setValue, getValues } = useForm({
        defaultValues: {
            membershipRedeemId: 0,
            userId: JSON.parse(localStorage.getItem("userData")).userId,
            membershipManagementId: "",
            billNo: "",
            serviceDetail: "",
            minutes: "",
            therapistName: "",
            attachedBillCopy: "",
            membershipRedeemFormName: "",
            isActive: true
        }
    });

    useEffect(() => {
        if(detail?.membershipManagementId) {
            setValue("membershipManagementId", detail?.membershipManagementId);
        }
    }, [detail, setValue])

    //use for images manually upload and drop
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
            setValue("attachedBillCopy", file);
            const reader = new FileReader();
            reader.onload = function (e) {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
            return file;
        });
    }, [setValue]);

    const handleGetVerify = async (info) => {
        try {
            if(!sentOtp) {
                const response = await getVerifyToRedeemMembership({
                    phone: customerDetail?.phoneNumber,
                    Minutes: info?.minutes,
                    ServiceDetail: info?.serviceDetail
                });
                if (response.status === 200) {
                    setSentOtp(true);
                } else {
                    showToast(response.message, false);
                }
            } else {
                const response = await verifyOtpForRedeemMembership({
                    PhoneNumber: customerDetail?.phoneNumber,
                    OTP: otp
                });
                if (response.status === 200) {
                    handleSave(getValues());
                    setSentOtp(false);
                } else {
                    showToast(response.message, false);
                }
            }
        } catch (err) {
            console.log(err);
            showToast(err.message, false);
        }
    }

    const handleSave = async (info) => {
        try {
            const response = await createUpdateMembershipRedeem(getFormData({...info, managerName: info.membershipRedeemFormName}));
            if (response.status === 200) {
                showToast(response.message, true);
                // closeRedeemForm(false);
                handleAfterRedeemSuccess();
            } else {
                showToast(response.message, false);
            }
        } catch (err) {
            console.log(err);
            showToast(err.message, false);
        }
    } 

    return (
        <MDBox>
            <MDBox
                mt={2}
                py={1}
                px={1}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
            >
                <MDTypography variant="h6" color="white">
                    Redeem
                </MDTypography>
            </MDBox>
            <MDBox pt={3} px={2}>
                {sentOtp ? 
                    <MDBox display="block">
                        <MDInput
                            type="text"
                            value={otp}
                            label="Enter OTP"
                            minLength={6}
                            maxLength={6}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <br/>
                        <br/>
                        <MDButton
                            component="button"
                            variant="gradient"
                            color="info"
                            onClick={() => setSentOtp(false)}
                        >
                           Back
                        </MDButton>
                        &nbsp;&nbsp;
                        <MDButton
                            component="button"
                            variant="gradient"
                            color="info"
                            disabled={otp.length !== 6}
                            onClick={handleSubmit(handleGetVerify)}
                        >
                            Verify OTP
                        </MDButton>
                    </MDBox>
                :
                <MDBox component="form" role="form" padding="0px 20px">
                    <MDBox >
                        <MDBox>
                            <MDBox mb={2}>
                                <Controller
                                    name="billNo"
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        // eslint-disable-next-line
                                        <MDInput
                                            type="text"
                                            value={value}
                                            label="Bill No"
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={error?.message ? error.message : ""}
                                            fullWidth
                                        />
                                    )}
                                    control={control}
                                    rules={{
                                        required: "Please add Bill No",
                                    }}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <Controller
                                    name="serviceDetail"
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        // eslint-disable-next-line
                                        <MDInput
                                            type="text"
                                            value={value}
                                            label="Service Detail"
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={error?.message ? error.message : ""}
                                            fullWidth
                                        />
                                    )}
                                    control={control}
                                    rules={{
                                        required: "Please add Service Detail",
                                    }}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <Controller
                                    name="minutes"
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id="selectMinutes">Select Minutes</InputLabel>
                                            <Select
                                                style={{ padding: "10px 0px" }}
                                                labelId="selectMinutes"
                                                id="minute-select"
                                                label="Select Minutes"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={error?.message ? error.message : ""}
                                            >
                                                {parseInt(detail?.remainingMinutes) < 60 ? <MenuItem value={detail?.remainingMinutes}>{detail?.remainingMinutes}</MenuItem> : null}
                                                {parseInt(detail?.remainingMinutes) >= 60 ? <MenuItem value="60">60</MenuItem> : null}
                                                {parseInt(detail?.remainingMinutes) >= 90 ? <MenuItem value="90">90</MenuItem> : null }
                                                {parseInt(detail?.remainingMinutes) >= 120 ? <MenuItem value="120">120</MenuItem> : null }
                                            </Select>
                                        </FormControl>
                                    )}
                                    control={control}
                                    rules={{
                                        required: "Please add Minutes",
                                        pattern: {
                                            value: /^[0-9]/,
                                            message: "Enter only digit",
                                        }
                                    }}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <Controller
                                    name="therapistName"
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        // eslint-disable-next-line
                                        <MDInput
                                            type="text"
                                            value={value}
                                            label="Therapist Name"
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={error?.message ? error.message : ""}
                                            fullWidth
                                        />
                                    )}
                                    control={control}
                                    rules={{
                                        required: "Please add Therapist Name",
                                    }}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <Controller
                                    name="membershipRedeemFormName"
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
                        </MDBox>
                        <MDBox mb={2}>
                            <InputLabel>Upload Invoice Copy</InputLabel>
                            <br/>
                            <MDBox mb={2}>
                                {selectedImage === null ?
                                    <Controller
                                        name="attachedBillCopy"
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <MDBox style={{
                                                textAlign: "center",
                                                cursor: "pointer",
                                                border: `1px solid ${error?.message ? 'red' : '#344767'}`,
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
                                            required: "Please add Invoice Copy",
                                        }}
                                    />
                                    :
                                    <MDBox style={{
                                        border: "1px solid #344767",
                                        borderRadius: "5px",
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        // display: "flex",
                                        // flexDirection: "row-reverse",
                                        cursor: "pointer",
                                    }}>
                                        <img style={{ width: "250px", height: "auto" }} src={selectedImage} alt="customer" />
                                        <Icon fontSize="large" onClick={() => setSelectedImage(null)}> delete</Icon>
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
                            onClick={() => closeRedeemForm(false)}
                            style={{ marginRight: "8px" }}
                            fullWidth
                        >
                            Back
                        </MDButton>
                        {/* <MDButton
                            component="button"
                            variant="gradient"
                            color="info"
                            onClick={handleSubmit(handleSave)}
                            fullWidth
                        >
                            Save
                        </MDButton> */}
                        <MDButton
                            component="button"
                            variant="gradient"
                            color="info"
                            onClick={handleSubmit(handleGetVerify)}
                            fullWidth
                        >
                            Get Verify
                        </MDButton>
                    </MDBox>
                </MDBox>
                }
            </MDBox>
        </MDBox>
    );
}

Redeem.propTypes = {
    detail: PropTypes.object.isRequired,
    closeRedeemForm: PropTypes.func.isRequired,
    customerDetail: PropTypes.object.isRequired,
    handleAfterRedeemSuccess: PropTypes.func.isRequired
};

export default Redeem;