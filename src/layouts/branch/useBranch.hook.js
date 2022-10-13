import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "@mui/material/Icon";

import MDTypography from "components/MDTypography";

import { fetchBranchList } from "service/branch.service";
import { showToast } from "utils/helper";

export const useBranch = () => {
    const [rows, setRows] = useState([]);
    const columns = [
        { Header: "Id", accessor: "branchId", width: "15%", align: "left" },
        { Header: "branchName", accessor: "branchName", align: "left" },
        { Header: "cityName", accessor: "cityName", align: "center" },
        { Header: "action", accessor: "action", align: "center" },
    ];
    
    const navigate = useNavigate();

    useEffect(() => {
        try {
          async function fetchBranch() {
            const response = await fetchBranchList({
              cityId: 0,
              searchText: "",
              isActive: true,
              page: 0,
              size: 100,
            });
            if (response.status === 200 && response.resultObject?.data?.length > 0) {
              const updatedData = response.resultObject.data?.map((data, index) => {
                return {
                  ...data,
                  action: (
                    <MDTypography
                      component="span"
                      onClick={() => navigate(`/branch/edit/${data.branchId}`)}
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
          fetchBranch();
        } catch (error) {
          showToast(error.message, false);
        }
      }, [navigate]);

    return {
        rows,
        columns,
        navigate,
        setRows
    }
}