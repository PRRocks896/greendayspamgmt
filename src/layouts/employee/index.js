import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// Material Dashboard 2 React components
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton"
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";


import { fetchEmployee, addFingerPrint } from "service/employee.service";
import { statusChange, deleteRecord } from "service/user.service";
import { showToast, isAdmin, getUserData, confirmationBox } from "utils/helper";

// Images
import fingerDefult from "assets/images/svg/fingerprint.svg";
import fingerSuccess from "assets/images/svg/fingerprintsuccess.svg";

function Employee() {
  const [ openModal, setOpenModal ] = useState(false);
  const [ id, setId ] = useState(null);
  const [rows, setRows] = useState([]);
  const columns = useCallback(() => {
    if(isAdmin()) {
      return [
        { Header: "index", accessor: "index", width: "15%", align: "left" },
        { Header: "firstName", accessor: "firstName", align: "left" },
        { Header: "fatherName", accessor: "fatherName", align: "center" },
        { Header: "mobileNumber", accessor: "mobileNumber", align: "center" },
        { Header: "branchName", accessor: "branchName", align: "center" },
        { Header: "cityName", accessor: "cityName", align: "center" },
        { Header: "status", accessor: "isActive", align: "center"},
        { Header: "Bio Metric", accessor: "touchId", align: "center"},
        { Header: "action", accessor: "action", align: "center" },
      ];
    } else {
      return [
        { Header: "index", accessor: "index", width: "15%", align: "left" },
        { Header: "firstName", accessor: "firstName", align: "left" },
        { Header: "fatherName", accessor: "fatherName", align: "center" },
        { Header: "mobileNumber", accessor: "mobileNumber", align: "center" },
        { Header: "branchName", accessor: "branchName", align: "center" },
        { Header: "cityName", accessor: "cityName", align: "center" },
        { Header: "Bio Metric", accessor: "touchId", align: "center"},
      ];
    }
  }, []);

  const navigate = useNavigate();

  const handleChangeStatus = useCallback(async (value, id) => {
    const response = await statusChange({
      moduleName: "Employee",
      id,
      isActive: value
    });
    if(response.status === 200) {
      const response = await fetchEmployee(
        isAdmin() ? {
          searchText: "",
          // isActive: true,
          page: 0,
          size: 1000,
        } : {
          searchText: "",
          // isActive: true,
          page: 0,
          size: 1000,
          cityId: getUserData().cityId,
          branchId: getUserData().userId
        }
      );
      if (response.status === 200 && response.resultObject?.data?.length > 0) {  
        setRows(response.resultObject?.data);
      }
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    if(confirmationBox("Are You Sure...?")) {
      const response = await deleteRecord({
        moduleName: "Employee",
        id
      });
      if(response.status === 200) {
        const response = await fetchEmployee(
          isAdmin() ? {
            searchText: "",
            // isActive: true,
            page: 0,
            size: 1000,
          } : {
            searchText: "",
            // isActive: true,
            page: 0,
            size: 1000,
            cityId: getUserData().cityId,
            branchId: getUserData().userId
          }
        );
        if (response.status === 200 && response.resultObject?.data?.length > 0) {
          setRows(response.resultObject?.data);
        }
      }
    }
  }, []);

  useEffect(() => {
    try {
      async function getEmployee() {
        const response = await fetchEmployee(
          isAdmin() ? {
            searchText: "",
            // isActive: true,
            page: 0,
            size: 1000,
          } : {
            searchText: "",
            // isActive: true,
            page: 0,
            size: 1000,
            cityId: getUserData().cityId,
            branchId: getUserData().userId
          });
        if (response.status === 200 && response.resultObject?.data?.length > 0) {
          setRows(response.resultObject?.data);
        }
      }
      getEmployee();
    } catch (err) {
      showToast(err.message, false);
    }
    return () => false;
  }, []);

  const handleFingerPrint = async () => {
    const isAtteched = window["GetMFS100Info"]();
    if(isAtteched.httpStaus && isAtteched.data.ErrorCode === "0") {
      let captureData = window["CaptureFinger"](70, 10);
      if (captureData.httpStaus) {
        if (captureData.data.ErrorCode === "0") {
          try {
            const response = await addFingerPrint({
              employeeId: id,
              touchId: captureData.data.IsoTemplate
            })
            if(response.status === 200) {
              showToast(response.message, true);
              setOpenModal(false);
              const res = await fetchEmployee(
                isAdmin() ? {
                  searchText: "",
                  page: 0,
                  size: 1000,
                } : {
                  searchText: "",
                  page: 0,
                  size: 1000,
                  cityId: getUserData().cityId,
                  branchId: getUserData().userId
                });
                if (res.status === 200 && res.resultObject?.data?.length > 0) {
                  setRows(res.resultObject?.data);
                } else {
                  showToast(res.message, false);
                }
            } else {
              showToast(response.message, false);
            }
          } catch(err) {
            showToast(err.message, false);
          }
        } else {
          showToast(captureData.data.ErrorDescription, false);
        }
      } else {
        showToast(captureData.err, false);
      }
    } else {
      showToast("Finger Scanner Not Attached", false);
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
                  Employees
                </MDTypography>
                {/* <MDTypography
                  variant="h6"
                  component={Link}
                  to="/employee/add"
                  borderRadius="lg"
                  color="white"
                  textAlign="end"
                >
                  <Icon fontSize="large">add</Icon>
                </MDTypography> */}
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: columns(), rows: rows?.map((data, index) => {
                    return {
                      ...data,
                      index: (index + 1),
                      isActive: (
                        <Switch checked={data?.isActive} onChange={(e) => handleChangeStatus(e.target.checked, data.employeeId)} />
                      ),
                      touchId: (
                        <>
                          {(data.touchId !== null && (typeof data.touchId === 'string' && data.touchId.length > 0)) ?
                            <MDAvatar src={fingerSuccess} size="lg"/>
                          :
                          <MDBox style={{cursor: "pointer"}} onClick={() => [setId(data.employeeId), setOpenModal(true)]}>
                            <MDAvatar src={fingerDefult} size="lg"/>
                          </MDBox>
                          }
                        </>
                      ),
                      action: (
                        <>
                        <MDTypography
                          component="span"
                          onClick={() => navigate(`/employee/edit/${data.employeeId}`)}
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          style={{ cursor: "pointer" }}
                        >
                          <Icon fontSize="medium">edit</Icon>
                        </MDTypography>
                        <MDTypography
                          component="span"
                          onClick={() => handleDelete(data.employeeId)}
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          style={{ cursor: "pointer" }}
                        >
                          <Icon fontSize="medium">delete</Icon>
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
              </MDBox>
              <Dialog open={openModal}>
                <DialogTitle>
                  <MDTypography variant="h4" style={{textAlign: 'center'}}>
                    Add Finger Print(click on fingerprint Icon)
                  </MDTypography>
                </DialogTitle>
                <DialogContent style={{textAlign: 'center'}}>
                  <MDBox style={{cursor: "pointer"}} onClick={() =>     handleFingerPrint()}>
                    <MDAvatar src={fingerDefult} size="lg"/>
                  </MDBox>
                </DialogContent>
                <DialogActions>
                  <MDButton onClick={() => setOpenModal(false)}>Cancel</MDButton>
                  {/* <MDButton onClick={handleFingerPrint}>Submit</MDButton> */}
                </DialogActions>
              </Dialog>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Employee;
