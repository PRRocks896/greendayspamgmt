/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

import { useForm, Controller } from "react-hook-form";

// @mui material components
import Card from "@mui/material/Card";
// import Switch from "@mui/material/Switch";
// import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";

// @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { loginOtpSend, loginOtpVerify } from "service/auth.service";
import { showToast } from "utils/helper";

function Basic() {
  const navigate = useNavigate();
  const [sentOtp, setSentOtp] = useState(false);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      mobileNumber: "",
      otp: "",
    },
  });

  const handleLogin = async (info) => {
    try {
      const response = await loginOtpSend(info.mobileNumber);
      if (response.status === 200) {
        setSentOtp(true);
      } else {
        showToast(response.message, false);
      }
    } catch (error) {
      console.error(error);
      showToast(error.message, false);
    }
  };

  const handleSentOtp = async (info) => {
    try {
      const response = await loginOtpVerify(info);
      if (response.status === 200 && response.resultObject) {
        localStorage.setItem("token", response.resultObject.token);
        localStorage.setItem("userData", JSON.stringify(response.resultObject));
        navigate("/dashboard");
      } else {
        showToast(response.message, false);
      }
    } catch (error) {
      console.error(error);
      showToast(error.message, false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            {!sentOtp && (
              <MDBox mb={2}>
                <Controller
                  name="mobileNumber"
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
                      message: "Enter only 10 digit number",
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
                  type="button"
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
                  type="submit"
                  variant="gradient"
                  color="info"
                  onClick={handleSubmit(handleSentOtp)}
                  fullWidth
                >
                  Verify OTP
                </MDButton>
              </MDBox>
            ) : (
              <MDBox mt={4} mb={1}>
                <MDButton
                  component="button"
                  type="submit"
                  variant="gradient"
                  color="info"
                  onClick={handleSubmit(handleLogin)}
                  fullWidth
                >
                  Get OTP
                </MDButton>
              </MDBox>
            )}
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
