import { useState, useEffect } from "react";
// react-router-dom components
import { useNavigate, useLocation } from "react-router-dom";
// react-hook-form components
import { useForm, Controller } from "react-hook-form";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { createUpdatePaidMode, fetchByIdPaidMode } from "service/paid.service";
import { showToast } from "utils/helper";

function AddEditPaid() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [id, setId] = useState(null);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
        paidModeId: 0,
        mode: ""
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

  useEffect(() => {
    if (id) {
      try {
        async function getPaidModeById(id) {
          const response = await fetchByIdPaidMode(id);
          if (response.status === 200) {
            reset(response.resultObject);
          } else {
            showToast(response.message, false);
          }
        }
        getPaidModeById(id);
      } catch (err) {
        showToast(err.message, false);
      }
    }
  }, [id, reset]);

  const handleSave = async (info) => {
      try {
        const response = await createUpdatePaidMode(info);
        if (response.status === 200) {
          showToast(response.message, true);
          navigate("/paidmode");
        } else {
          showToast(response.message, false);
        }
      } catch (err) {
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
                  {id ? "Edit" : "Add"} Paid Mode
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox component="form" role="form" padding="0px 20px">
                  <MDBox mb={2}>
                    <Controller
                      name="mode"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <MDInput
                          type="text"
                          value={value}
                          label="Mode"
                          onChange={onChange}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          fullWidth
                        />
                      )}
                      control={control}
                      rules={{
                        required: "Please add Mode",
                      }}
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1} style={{ display: "flex" }}>
                    <MDButton
                      component="button"
                      variant="gradient"
                      color="info"
                      onClick={() => navigate("/paidmode")}
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
                      {id ? "Update" : "Save"}
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

export default AddEditPaid;
