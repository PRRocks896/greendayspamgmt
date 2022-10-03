import { useCallback, useEffect, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-hook-form components
import { useForm, Controller } from "react-hook-form";

// @mui material components
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDDragdrop from "components/MDDragdrop";

import { createUpdateMembershipRedeem } from "service/membership-redeem.service";

import { getFormData, showToast } from "utils/helper";

function Redeem(props) {
    const {detail, closeRedeemForm} = props;
    const [selectedImage, setSelectedImage] = useState(null);
    const { handleSubmit, control, setValue } = useForm({
        defaultValues: {
            membershipRedeemId: 0,
            userId: JSON.parse(localStorage.getItem("userData")).userId,
            membershipManagementId: "",
            serviceDetail: "",
            minutes: "",
            therapistName: "",
            attachedBillCopy: "",
            membershipRedeemFormName: "",
            isActive: true
        }
    });

    useEffect(() => {
        setValue("membershipManagementId", detail.membershipManagementId);
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

    const handleSave = async (info) => {
        console.log(info);
        console.log(getFormData(info));
        try {
            const response = await createUpdateMembershipRedeem(getFormData(info));
            if (response.status === 200) {
                showToast(response.message, true);
                closeRedeemForm(false)
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
                <MDBox component="form" role="form" padding="0px 20px">
                    <MDBox >
                        <MDBox>
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
                                        // eslint-disable-next-line
                                        <MDInput
                                            type="text"
                                            value={value}
                                            label="Minutes"
                                            onChange={onChange}
                                            error={!!error}
                                            helperText={error?.message ? error.message : ""}
                                            fullWidth
                                        />
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
                                            required: "Please add Invoice Copy",
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
                                        <Icon fontSize="large" onClick={() => setSelectedImage(null)}> delete</Icon>
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
                            // onClick={() => navigate("/membershipplan")}
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
        </MDBox>
    );
}

Redeem.propTypes = {
    detail: PropTypes.object.isRequired,
    closeRedeemForm: PropTypes.func.isRequired,
};

export default Redeem;