import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { fetchPaidMode } from "service/paid.service";
import { showToast } from "utils/helper";

function Paid() {
  const [rows, setRows] = useState([]);
  const columns = [
    { Header: "Id", accessor: "paidModeId", width: "15%", align: "left" },
    { Header: "mode", accessor: "mode", align: "left" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    try {
      async function getPaidMode() {
        const response = await fetchPaidMode({
          searchText: "",
          isActive: true,
          page: 0,
          size: 1000,
        });
        if (response.status === 200 && response.resultObject?.data?.length > 0) {
          const updatedData = response.resultObject.data?.map((data, index) => {
            return {
              ...data,
              action: (
                <MDTypography
                  component="span"
                  onClick={() => navigate(`/paidmode/edit/${data.paidModeId}`)}
                  variant="caption"
                  color="text"
                  fontWeight="medium"
                  style={{ cursor: "pointer" }}
                >
                  <Icon fontSize="medium">edit</Icon>
                  {/* Edit */}
                </MDTypography>
              ),
            };
          });
          setRows(updatedData);
        }
      }
      getPaidMode();
    } catch (err) {
      showToast(err.message, false);
    }
  }, [navigate, setRows]);

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
                  Paid Mode
                </MDTypography>
                <MDTypography
                  variant="h6"
                  component={Link}
                  to="/paidmode/add"
                  borderRadius="lg"
                  color="white"
                  textAlign="end"
                >
                  <Icon fontSize="large">add</Icon>
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  canSearch={true}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Paid;
