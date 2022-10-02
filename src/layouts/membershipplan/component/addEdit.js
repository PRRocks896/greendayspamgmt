import { useState, useEffect } from "react";
// react-router-dom components
import { useNavigate, useLocation } from "react-router-dom";
// react-hook-form components
import { useForm, Controller } from "react-hook-form";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { createMembershipPlan, fetchByIdMembershipPlan } from "service/membership.service";
import { showToast } from "utils/helper";

function AddEditMembershipPlan() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [id, setId] = useState(null);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      membershipPlanId: 0,
      planName: "",
      minutes: "",
      type: 1,
      isActive: true,
    },
  });

  useEffect(() => {
    if (pathname.includes("edit")) {
      const splitData = pathname.split("/");
      if (splitData.length === 4) {
        setId(splitData[3]);
      }
    }
  }, [pathname]);

  useEffect(async () => {
    if (id) {
      try {
        const response = await fetchByIdMembershipPlan(id);
        if (response.status === 200) {
          reset(response.resultObject);
        } else {
          showToast(response.message, false);
        }
      } catch (err) {
        showToast(err.message, false);
      }
    }
  }, [id]);

  const handleSave = async (info) => {
    try {
      const response = await createMembershipPlan(info);
      if (response.status === 200) {
        showToast(response.message, true);
        navigate("/membershipplan");
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
                  Add Membership Plan
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox component="form" role="form" padding="0px 20px">
                  <MDBox mb={2}>
                    <Controller
                      name="planName"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <MDInput
                          type="text"
                          value={value}
                          label="Plan Name"
                          onChange={onChange}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          fullWidth
                        />
                      )}
                      control={control}
                      rules={{
                        required: "Please add plan name",
                      }}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <Controller
                      name="minutes"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                        required: "Please Enter Minutes",
                      }}
                    />
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

export default AddEditMembershipPlan;
