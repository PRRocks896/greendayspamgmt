import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';

// Material Dashboard 2 React components
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton"
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import {
    fetchAttendanceList,
    approveAttendance
} from "service/attendance.service";
import { endpoint } from "utils/constant";
import { showToast, getUserData, convertDate } from "utils/helper";

// Images
import fingerDefult from "assets/images/svg/fingerprint.svg";
import fingerSuccess from "assets/images/svg/fingerprintsuccess.svg";
import fingerFail from "assets/images/svg/fingerprintfail.svg";
import * as m from "moment";

function Attendance() {
    const [branchData, setBranchData] = useState([]);
    const [scanned, setScanned] = useState(0);
    const [matchData, setMatchData] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [isShowCustomerAttend, setIsShowCustomerAttend] = useState(false);
    const [totalCustomerAttend, setTotalCustomerAttend] = useState(0);

    useEffect(() => {
        try {
          async function fetchBranchData() {
            const response = await fetchAttendanceList({
                isActive: true,
                searchText: "",
                branchId: getUserData()?.userId
            });
            if (response.status === 200 && response.resultObject?.data?.length > 0) {
                setBranchData(response.resultObject.data);
            }
          }
          fetchBranchData();
        } catch (error) {
          showToast(error.message, false);
        }
    }, []);

    const handleAttendance = async () => {
        const isAtteched = window["GetMFS100Info"]();
        if(isAtteched.httpStaus && isAtteched.data.ErrorCode === "0") {
            setScanned(0);
            let captureData = window["CaptureFinger"](70, 10);
            if (captureData.httpStaus) {
                if (captureData.data.ErrorCode === "0") {
                    captureData = captureData.data.IsoTemplate
                }
            }
            let matchedData = null;
            branchData.forEach((data) => {
                const res = window["VerifyFinger"](captureData, data?.touchId) //window["MatchFinger"](70, 10, data?.touchId);
                if (res.httpStaus) {
                    if (res.data.Status) {
                        matchedData = data;
                        setMatchData(data)
                    }
                }
            });
            if(matchedData !== null) {
                setScanned(1);
                setOpenDetailModal(true);
                if(!matchedData.isTimeIn) {
                    // TODO Remove after complete
                    setTimeout(() => {
                        setOpenDetailModal(false);
                        setScanned(0)
                    }, 7000);
                    const payload = {
                        employeeId: matchedData?.employeeId,
                        time: convertDate(new Date())
                    }
                    try {
                        const response = await approveAttendance(payload);
                        if (response.status === 200) {
                            showToast(response.message, true);
                            const resData = await fetchAttendanceList({
                                isActive: true,
                                searchText: "",
                                branchId: getUserData()?.userId
                            });
                            if (resData.status === 200 && resData.resultObject?.data?.length > 0) {
                                setBranchData(resData.resultObject.data);
                            } else {
                                showToast(resData.message, false);
                            }
                        } else {
                            setOpenDetailModal(false);
                            showToast(response.message, false);
                        }
                    } catch(err) {
                        console.error(err);
                        showToast(err.message, false);
                    }
                } else {
                    setIsShowCustomerAttend(true)
                }
            } else {
                setScanned(2);
                showToast("Finger Print not Match", false);
            }
        } else {
            showToast("Finger Scanner Not Attached", false);
        }
    }

    const handleCustomerAttend = async () => {
        const payload = {
            employeeId: matchData?.employeeId,
            time: convertDate(new Date()),
            customerAttend: parseInt(totalCustomerAttend)
        }
        try {
            const response = await approveAttendance(payload);
            if (response.status === 200) {
                showToast(response.message, true);
                
                const resData = await fetchAttendanceList({
                    isActive: true,
                    searchText: "",
                    branchId: getUserData()?.userId
                });
                if (resData.status === 200 && resData.resultObject?.data?.length > 0) {
                    setBranchData(resData.resultObject.data);
                } else {
                    showToast(resData.message, false);
                }
            } else {
                showToast(response.message, false);
            }
        } catch(err) {
            console.error(err);
            showToast(err.message, false);
        } finally {
            setScanned(0)
            setIsShowCustomerAttend(false);
            setTotalCustomerAttend(null);
            setOpenDetailModal(false);
            setMatchData(null);
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
                                    Attendance
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={6}>
                                <MDBox pl={4}>
                                    <InputLabel>Take Attendance <b>(Click on Finger Print Image)</b></InputLabel>
                                    <br />
                                    <MDBox style={{cursor: 'pointer', paddingLeft: '150px'}} onClick={handleAttendance}>
                                        {scanned === 0 && <MDAvatar src={fingerDefult} size="xxl"/>}
                                        {scanned === 1 && <MDAvatar src={fingerSuccess} size="xxl"/>}
                                        {scanned === 2 && <MDAvatar src={fingerFail} size="xxl"/>}
                                    </MDBox>
                                </MDBox>
                                
                            </MDBox>
                            {/* Show Employee Detail */}
                            <Dialog disableEscapeKeyDown open={openDetailModal}>
                                <DialogTitle>
                                    <MDTypography variant="h4" style={{textAlign: 'center'}}>
                                        Employee Detail
                                    </MDTypography>
                                </DialogTitle>
                                <DialogContent style={{textAlign: 'center'}}>
                                    <Card style={{padding: '0px 100px 30px 100px'}}>
                                        <MDBox>
                                            <img style={{borderRadius: '25px', width: '200px', height: 'auto'}} src={`${endpoint}/${matchData?.livePhotoPath}`} alt="Employee"/>
                                        </MDBox>
                                        <MDBox>
                                            <b>Name:</b> {matchData?.firstName} 
                                        </MDBox>
                                        <MDBox>
                                            <b>Phone Number:</b> {matchData?.mobileNumber}
                                        </MDBox>
                                        <MDBox>
                                            <b>Employee Type:</b> {matchData?.employeeTypeName}
                                        </MDBox>
                                        <MDBox>
                                            <b>Date:</b> {m(new Date()).format('yyyy-MM-DD hh:mm a')}
                                        </MDBox>
                                        {isShowCustomerAttend &&
                                            <>
                                            <MDTypography variant="p">
                                                <b>How many Customer Attend:</b>
                                            </MDTypography>
                                            <MDInput
                                                type="text"
                                                value={totalCustomerAttend}
                                                label=""
                                                onChange={(e) => setTotalCustomerAttend(e.target.value)}
                                                fullWidth
                                            />
                                            </>
                                        }
                                        <MDBox>

                                        </MDBox>
                                    </Card>
                                </DialogContent>
                                <DialogActions>
                                    {/* <MDButton onClick={() => setOpenDetailModal(false)}>Cancel</MDButton> */}
                                    {isShowCustomerAttend &&
                                        <MDButton onClick={handleCustomerAttend}>Submit</MDButton>
                                    }
                                </DialogActions>
                            </Dialog>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}

export default Attendance;