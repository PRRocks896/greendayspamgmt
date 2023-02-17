import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// react-hook-form components
import { useForm, Controller } from "react-hook-form";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { fetchMembershipMgmt } from "service/membership-mgmt.service";
import { statusChange } from "service/user.service";
import { fetchCityList } from "service/city.service";
import { fetchBranchList } from "service/branch.service";
import { showToast, isAdmin, getUserData } from "utils/helper";

function MembershipMgmt() {
  const [cityList, setCityList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [rows, setRows] = useState([]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      cityId: isAdmin() ? "" : getUserData().cityId,
      branchId: isAdmin() ? "" : getUserData().userId,
    }
  });

  const columns = useCallback(() => {
    if(isAdmin()) {
      return [
        { Header: "bill No", accessor: "billNo", align: "left" },
        { Header: "customer Name", accessor: "customerName", align: "left" },
        { Header: "phone Number", accessor: "phoneNumber", align: "left" },
        { Header: "plan Name", accessor: "planName", align: "left" },
        { Header: "paid By", accessor: "paidBy", align: "left" },
        { Header: "manager Name", accessor: "managerName", align: "left" },
        { Header: "action", accessor: "action", align: "center" }
      ]
    } else {
      return [
        { Header: "bill No", accessor: "billNo", align: "left" },
        { Header: "customer Name", accessor: "customerName", align: "left" },
        { Header: "phone Number", accessor: "phoneNumber", align: "left" },
        { Header: "plan Name", accessor: "planName", align: "left" },
        { Header: "paid By", accessor: "paidBy", align: "left" },
        { Header: "manager Name", accessor: "managerName", align: "left" }
      ]
    }
  }, []);

  const navigate = useNavigate();

  const handleChangeStatus = useCallback(async (value, id) => {
    const response = await statusChange({
      moduleName: "MembershipManagement",
      id,
      isActive: value
    });
    if(response.status === 200) {
      const response = await fetchMembershipMgmt({
        searchText: "",
        // isActive: true,
        page: 0,
        size: 1000,
        cityId: isAdmin() ? 0 : getUserData().cityId,
        branchId: isAdmin() ? 0 : getUserData().userId,
      });
      if (response.status === 200 && response.resultObject?.data?.length > 0) {
        setRows(response.resultObject.data);
      }
    }
  }, []);

  useEffect(() => {
    try {
      async function fetchCity() {
        const resCity = await fetchCityList();
        setCityList(resCity.resultObject);
      }
      fetchCity();
    } catch (err) {
      showToast(err.message, false);
    }
  }, [/*navigate, setRows*/]);

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

  const handleSearch = async (info) => {
    try {
      const response = await fetchMembershipMgmt({
        searchText: "",
        isActive: true,
        page: 0,
        size: 1000,
        cityId: isAdmin() ? info.cityId : getUserData().cityId,
        branchId: isAdmin() ? info.branchId : getUserData().userId,
        isRejected: false
      });
      if (response.status === 200 && response.resultObject?.data?.length > 0) {
        setRows(response.resultObject.data);
      } else {
        setRows([]);
      }
    } catch(err) {
      showToast(err.message, false);
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
                borderRadius="lg"
                display="grid"
                gridTemplateColumns="1fr 1fr"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Membership Management
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
              <MDBox component="form" role="form" padding="0px 20px">
                <MDBox display="grid" gridTemplateColumns="0.5fr 0.5fr 0.5fr 0.5fr 1fr">
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
                  <MDBox mb={2} pl={1}>
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
                  </>
                  : null}
                  <MDBox mb={2} pl={1}>
                  </MDBox>
                  <MDButton
                    style={{ marginLeft: "8px", marginBottom: "16px" }}
                    component="button"
                    variant="gradient"
                    color="info"
                    onClick={handleSubmit(handleSearch)}
                  >
                    Search
                  </MDButton>
                </MDBox>
                </MDBox>
                {rows.length > 0 ? 
                <DataTable
                  table={{ columns: columns(), rows: rows?.map((data) => {
                    return {
                      ...data,
                      isActive: (
                        <Switch checked={data?.isActive} onChange={(e) => handleChangeStatus(e.target.checked, data.membershipManagementId)} />
                      ),
                      action: (
                        <>
                        <MDTypography
                          component="span"
                          onClick={() => navigate(`/membershipmgmt/edit/${data.membershipManagementId}`)}
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          style={{ cursor: "pointer" }}
                        >
                          <Icon fontSize="medium">edit</Icon>
                        </MDTypography>
                      </>
                      ),
                    };}) 
                  }}
                  canSearch={true}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                />
                :
                  <MDBox mb={2} pl={2}>
                    <h3>No Record Found</h3>
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

export default MembershipMgmt;
