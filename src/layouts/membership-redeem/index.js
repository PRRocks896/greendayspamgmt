import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// react-hook-form components
import { useForm, Controller } from "react-hook-form";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Redeem from "layouts/membership-redeem/component/redeem";

import { sendMembershipRedeemOtpSend, fetchMembershipRedeem } from "service/membership-redeem.service";
import { showToast } from "utils/helper";
import { endpoint } from "utils/constant";

function MembershipRedeem() {
  const [redeemDetail, setRedeemDetail] = useState(null);
  const [redeemFormShow, setRedeemFormShow] = useState(false);
  const [sentOtp, setSentOtp] = useState(false);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      phoneNumber: "",
      otp: "",
    },
  });

  const handleSendOtp = async (info) => {
    try {
        const response = await sendMembershipRedeemOtpSend(info.phoneNumber);
        if (response.status === 200) {
            setSentOtp(true);
            showToast(response.message, true);
        } else {
            showToast(response.message, false);
        }
    } catch (error) {
        showToast(error.message, false);
    }
  }

  const handleFetchRedeem = async (info) => {
    try {
        const response = await fetchMembershipRedeem(info.phoneNumber, info.otp);
        if (response.status === 200) {
            setRedeemDetail(response.resultObject);
        } else {
            showToast(response.message, false);
        }
    } catch (error) {
        showToast(error.message, false);
    } finally {
        setSentOtp(false);
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
                borderRadius="10px"
                display="grid"
                gridTemplateColumns="1fr 1fr"
                coloredShadow="info"
                border="1px solid #344767"
                padding="10px"
              >
                <MDTypography variant="h6" color="white">
                  Membership Redeem
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={3}>
                {!redeemDetail ?
                    <MDBox component="form" role="form">
                        {!sentOtp && (
                            <MDBox mb={2}>
                              <Controller
                              name="phoneNumber"
                              render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <MDInput
                                  type="text"
                                  value={value}
                                  label="Mobile Number"
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
                                  message: "Enter only digit allow",
                                  },
                              }}
                              />
                          </MDBox>
                        )}
                        {sentOtp && (
                            <MDBox mb={2}>
                                <Controller
                                name="otp"
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <MDInput
                                    type="password"
                                    value={value}
                                    label="OTP"
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error?.message ? error.message : ""}
                                    fullWidth
                                    />
                                )}
                                control={control}
                                rules={{
                                    required: "Please enter OTP",
                                    minLength: {
                                    value: 6,
                                    message: "Cannot be smaller than 6 characters",
                                    },
                                    maxLength: {
                                    value: 6,
                                    message: "Cannot be longer than 6 characters",
                                    },
                                    pattern: {
                                    value: /^[0-9]/,
                                    message: "Enter only enter number",
                                    },
                                }}
                                />
                            </MDBox>
                        )}
                        {sentOtp ? (
                            <MDBox mt={4} mb={1} style={{ display: "flex" }}>
                              <MDButton
                                component="button"
                                variant="gradient"
                                color="info"
                                onClick={() => [setSentOtp(false), setValue("otp", "")]}
                                style={{ marginRight: "8px" }}
                                fullWidth
                                >
                                Edit Mobile No.
                                </MDButton>
                                <MDButton
                                component="button"
                                variant="gradient"
                                color="info"
                                onClick={handleSubmit(handleFetchRedeem)}
                                fullWidth
                                >
                                Verify OTP
                              </MDButton>
                            </MDBox>
                        ) : (
                            <MDBox mt={4} mb={1}>
                              <MDButton
                                component="button"
                                variant="gradient"
                                color="info"
                                onClick={handleSubmit(handleSendOtp)}
                                fullWidth
                                >
                                Get OTP
                              </MDButton>
                            </MDBox>
                        )}
                    </MDBox>
                : 
                  <MDBox style={{display: "grid", gridTemplateColumns: "3fr 1fr"}}>
                    <MDBox>
                      <MDTypography variant="span">
                        Customer Name: {redeemDetail.customerName}
                      </MDTypography>
                      <br />
                      <MDTypography variant="span">
                        Phone No: {redeemDetail.phoneNumber}
                      </MDTypography>
                      <br />
                      <MDTypography variant="span">
                        Plan Name: {redeemDetail.planName}
                      </MDTypography>
                      <br />
                      <MDTypography variant="span">
                        Duration: {redeemDetail.minutes} Min.
                      </MDTypography>
                      <br/>
                      <br/>
                      <MDButton variant="gradient" color="info" onClick={() => setRedeemFormShow(true)}>Redeem</MDButton>
                    </MDBox>
                    <MDBox>
                      <img style={{ height: "calc(100vh - 250px)" }} src={`${endpoint}/${redeemDetail.customerPhotoPath}`} alt="customer" />
                    </MDBox>
                  </MDBox>
                }
                {redeemFormShow &&
                  <MDBox mb={2}>
                    <Redeem detail={redeemDetail} closeRedeemForm={setRedeemFormShow}/>
                  </MDBox>
                }
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default MembershipRedeem;
