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

import { showToast, getUserData, convertDate } from "utils/helper";

// Images
import fingerDefult from "assets/images/svg/fingerprint.svg";
import fingerSuccess from "assets/images/svg/fingerprintsuccess.svg";
import fingerFail from "assets/images/svg/fingerprintfail.svg";

function Attendance() {
    const [branchData, setBranchData] = useState([]);
    const [scanned, setScanned] = useState(0);
    const [matchData, setMatchData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [totalCustomerAttend, setTotalCustomerAttend] = useState();

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
        setScanned(0);
        let captureData = window["CaptureFinger"](70, 10);
        if (captureData.httpStaus) {
            if (captureData.data.ErrorCode === "0") {
                captureData = captureData.data.IsoTemplate
            }
        }
        let matchedData;
        branchData.forEach((data) => {
            const res = window["VerifyFinger"](captureData, data?.touchId) //window["MatchFinger"](70, 10, data?.touchId);
            console.log(res)
            if (res.httpStaus) {
                if (res.data.Status) {
                    matchedData = data;
                    setMatchData(data)
                }
            }
        });
        console.log(matchedData)
        if(matchedData !== null) {
            setScanned(1);
            if(!matchedData.isTimeIn) {
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
                        showToast(response.message, false);
                    }
                } catch(err) {
                    console.error(err);
                    showToast(err.message, false);
                }
            } else {
                setOpenModal(true);
                // showToast("", false);
            }
        } else {
            setScanned(2);
            showToast("Finger Print not Match", false);
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
                setOpenModal(false)
                setTotalCustomerAttend(null)
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
                                    <InputLabel>Take Attendance</InputLabel>
                                    <br />
                                    <MDBox style={{cursor: 'pointer', paddingLeft: '150px'}} onClick={handleAttendance}>
                                        {scanned === 0 && <MDAvatar src={fingerDefult} size="xxl"/>}
                                        {scanned === 1 && <MDAvatar src={fingerSuccess} size="xxl"/>}
                                        {scanned === 2 && <MDAvatar src={fingerFail} size="xxl"/>}
                                    </MDBox>
                                </MDBox>
                                {/* <DataTable
                                    table={{ columns, rows: rows?.map((data, index) => {
                                       return {
                                        ...data,
                                        action: (
                                            <MDBox>
                                                <MDTypography
                                                    component="span"
                                                    onClick={() => handleAttendance(data)}
                                                    variant="caption"
                                                    color="text"
                                                    fontWeight="medium"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <Icon fontSize="medium">create</Icon>
                                                </MDTypography>
                                            </MDBox>
                                        )
                                       } 
                                    }) }}
                                    isSorted={true}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                /> */}
                            </MDBox>
                            <Dialog onClose={() => setOpenModal(false)} open={openModal}>
                                <DialogTitle>How many Customer Attend..?</DialogTitle>
                                <DialogContent>
                                <MDInput
                                    type="text"
                                    value={totalCustomerAttend}
                                    label=""
                                    onChange={(e) => setTotalCustomerAttend(e.target.value)}
                                    fullWidth
                                />
                                </DialogContent>
                                <DialogActions>
                                    <MDButton onClick={() => setOpenModal(false)}>Cancel</MDButton>
                                    <MDButton onClick={handleCustomerAttend}>Submit</MDButton>
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