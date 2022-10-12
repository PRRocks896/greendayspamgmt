import { useState, useEffect } from "react";
// react-router-dom components
import { useNavigate, useLocation } from "react-router-dom";
// react-hook-form components
import { useForm, Controller } from "react-hook-form";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import moment from "moment";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { createBranch, fetchByIdBranch, updateBranch } from "service/branch.service";
import { fetchCityList } from "service/city.service";
import { showToast } from "utils/helper";

function AddEditBranch() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [id, setId] = useState(null);
  const [cityList, setCityList] = useState([]);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      roleID: 2,
      cityId: "",
      branchName: "",
      mobileNumber: "",
      landlineNumber: "",
      emailId: "",
      address: "",
      openingDate: moment().format("yyyy-MM-DD"),
    },
  });

  useEffect(() => {
    async function fetchCity() {
      try {
        const response = await fetchCityList();
        if (response.status === 200) {
          setCityList(response.resultObject);
        } else {
          showToast(response.message, false);
        }
      } catch (err) {
        showToast(err.message, false);
      }
    }
    fetchCity();
  }, []);

  useEffect(() => {
    if (pathname.includes("edit")) {
      setIsEditMode(true);
      const splitData = pathname.split("/");
      if (splitData.length === 4) {
        setId(splitData[3]);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (id) {
      async function branchByID(id) {
        try {
          const response = await fetchByIdBranch(id);
          if (response.status === 200) {
            reset({
              ...response.resultObject,
              openingDate: moment(response.resultObject?.openingDate).format("yyyy-MM-DD"),
            });
          } else {
            showToast(response.message, false);
          }
        } catch (err) {
          showToast(err.message, false);
        }
      }
      branchByID(id);
    }
  }, [id, reset]);

  const handleSave = async (info) => {
    if (isEditMode) {
      const response = await updateBranch({ ...info, userId: id });
      if (response.status === 200) {
        showToast(response.message, true);
        navigate("/branch");
      } else {
        showToast(response.message, false);
      }
    } else {
      try {
        const response = await createBranch(info);
        if (response.status === 200) {
          showToast(response.message, true);
          navigate("/branch");
        } else {
          showToast(response.message, false);
        }
      } catch (err) {
        showToast(err.message, false);
      }
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
                  {id ? "Edit" : "Add"} Branch
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <MDBox component="form" role="form" padding="0px 20px">
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
                              <MenuItem key={`city_list_${index}`} value={city.value}>
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
                      name="branchName"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        // eslint-disable-next-line
                        <MDInput
                          type="text"
                          value={value}
                          label="Branch Name"
                          onChange={onChange}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          fullWidth
                        />
                      )}
                      control={control}
                      rules={{
                        required: "Please add branch name",
                      }}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <Controller
                      name="mobileNumber"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        // eslint-disable-next-line
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
                          message: "Enter only digit",
                        },
                      }}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <Controller
                      name="landlineNumber"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        // eslint-disable-next-line
                        <MDInput
                          type="text"
                          value={value}
                          label="Landline Number"
                          onChange={onChange}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          fullWidth
                        />
                      )}
                      control={control}
                      rules={{
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
                  <MDBox mb={2}>
                    <Controller
                      name="address"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        // eslint-disable-next-line
                        <MDInput
                          type="text"
                          value={value}
                          label="Branch Address"
                          onChange={onChange}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          fullWidth
                        />
                      )}
                      control={control}
                      rules={{
                        required: "Please Enter Address",
                      }}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <Controller
                      name="openingDate"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        // eslint-disable-next-line
                        <MDInput
                          type="date"
                          value={value}
                          label="Opening Date"
                          onChange={onChange}
                          error={!!error}
                          helperText={error?.message ? error.message : ""}
                          fullWidth
                        />
                      )}
                      control={control}
                      rules={{
                        required: "Please Enter Opening Date",
                      }}
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1} style={{ display: "flex" }}>
                    <MDButton
                      component="button"
                      variant="gradient"
                      color="info"
                      onClick={() => navigate("/branch")}
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

export default AddEditBranch;
