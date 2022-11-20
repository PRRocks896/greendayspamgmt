import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// react-hook-form components
import { useForm, Controller } from "react-hook-form";
import * as m from "moment";

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
import DataTable from "examples/Tables/DataTable";
import Redeem from "layouts/membership-redeem/component/redeem";

import { fetchMembershipRedeem } from "service/membership-redeem.service";
import { showToast } from "utils/helper";

function MembershipRedeem() {
  const [redeemDetail, setRedeemDetail] = useState(null);
  const [redeemFormShow, setRedeemFormShow] = useState(false);

  const { handleSubmit, control, getValues } = useForm({
    defaultValues: {
      phoneNumber: "",
      otp: "",
    },
  });

  const handleFetchRedeem = async (info) => {
    try {
      const response = await fetchMembershipRedeem(info.phoneNumber);
      if (response.status === 200) {
          setRedeemDetail(response.resultObject);
      } else {
          showToast(response.message, false);
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }

  const handleAfterRedeemSuccess = () => {
    setRedeemDetail(null);
    setRedeemFormShow(false);
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
                {(!redeemFormShow && !redeemDetail) ?
                    <MDBox component="form" role="form">
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
                      <MDBox mt={4} mb={1}>
                        <MDButton
                          component="button"
                          variant="gradient"
                          color="info"
                          onClick={handleSubmit(handleFetchRedeem)}
                          fullWidth
                          >
                          Get Info
                        </MDButton>
                      </MDBox>
                    </MDBox>
                : null}
                {(!redeemFormShow && redeemDetail) ?
                  <>
                    <MDBox style={{display: "grid", gridTemplateColumns: "3fr 1fr"}}>
                      <MDBox>
                        <MDTypography variant="span">
                          Customer Name: {redeemDetail?.customerName}
                        </MDTypography>
                        <br />
                        <MDTypography variant="span">
                          Phone No: {redeemDetail?.phoneNumber}
                        </MDTypography>
                        <br />
                        <MDTypography variant="span">
                          Date: {m(redeemDetail?.customerJoinDate).format('DD/MM/yyyy hh:mm a')}
                        </MDTypography>
                        <br/>
                        <MDTypography variant="span">
                          Bill No: {redeemDetail?.customerBillNo}
                        </MDTypography>
                        <br/>
                        <MDTypography variant="span">
                          Plan Name: {redeemDetail?.planName}
                        </MDTypography>
                        <br />
                        <MDTypography variant="span">
                          Extra Hours: {redeemDetail?.extraHours}
                        </MDTypography>
                        <br />
                        <MDTypography variant="span">
                          Duration: {redeemDetail?.minutes} Min.
                        </MDTypography>
                        <br/>
                        <MDTypography variant="span">
                          Remaining Minutes: {redeemDetail?.remainingMinutes} Min.
                        </MDTypography>
                        <br/>
                        <br/>
                        {parseInt(redeemDetail?.remainingMinutes) > 0 ?
                          <MDButton variant="gradient" color="info" onClick={() => setRedeemFormShow(true)}>Redeem</MDButton>
                        : 
                          <MDTypography variant="h4" style={{color: "red"}}>
                            Customer Don't have Minutes
                          </MDTypography> 
                        }
                      </MDBox>
                      <MDBox>
                        {/* <img style={{ height: "calc(100vh - 450px)" }} src={`${endpoint}/${redeemDetail.customerPhotoPath}`} alt="customer" /> */}
                      </MDBox>
                    </MDBox>
                    {redeemDetail?.redeemHistoryList.length > 0 ?
                      <MDBox>
                        <MDTypography variant="h4">
                          Redeem History:
                        </MDTypography>
                        <MDBox pt={3}>
                          <DataTable
                            table={{ columns: [
                              { Header: "billNo", accessor: "billNo", align: "center" },
                              { Header: "branchName", accessor: "branchName", align: "center" },
                              { Header: "serviceDetail", accessor: "serviceDetail", align: "center" },
                              { Header: "minute", accessor: "minute", align: "center" },
                              { Header: "therapistName", accessor: "therapistName", align: "center" },
                              { Header: "managerName", accessor: "managerName", align: "center" },
                              { Header: "date", accessor: "date", align:"center"}
                            ], rows: redeemDetail?.redeemHistoryList?.map((res) => ({...res, date: m(res.date).format("DD/MM/yyyy hh:mm a")})) }}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                          />
                        </MDBox>
                      </MDBox>
                      : null
                    }
                  </>
                : null}
                {redeemFormShow &&
                  <MDBox mb={2}>
                    <Redeem detail={redeemDetail} customerDetail={getValues()} closeRedeemForm={setRedeemFormShow} handleAfterRedeemSuccess={handleAfterRedeemSuccess}/>
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
