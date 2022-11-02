import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import Icon from "@mui/material/Icon";

// import MDTypography from "components/MDTypography";

import { fetchBranchList } from "service/branch.service";
import { statusChange, deleteRecord } from "service/user.service";
import { showToast, confirmationBox } from "utils/helper";

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
              // isActive: true,
              page: 0,
              size: 100,
            });
            if (response.status === 200 && response.resultObject?.data?.length > 0) {
              setRows(response.resultObject.data);
            }
          }
          fetchBranch();
        } catch (error) {
          showToast(error.message, false);
        }
      }, [navigate]);

    const handleDelete = async (id) => {
      if(confirmationBox("Are You Sure...?")) {
        try {
          const response = await deleteRecord({
            moduleName: "Branch",
            id
          });
          if(response.status === 200) {
            const response = await fetchBranchList({
              cityId: 0,
              searchText: "",
              // isActive: true,
              page: 0,
              size: 100,
            });
            if (response.status === 200 && response.resultObject?.data?.length > 0) {
              setRows(response.resultObject.data);
            }
          }
        } catch (error) {
          showToast(error.message, false);
        }
      }
    }

    const handleChangeStatus = async (value, id) => {
      try {
        const response = await statusChange({
          moduleName: "Branch",
          id,
          isActive: value
        });
        if(response.status === 200) {
          const response = await fetchBranchList({
            cityId: 0,
            searchText: "",
            // isActive: true,
            page: 0,
            size: 100,
          });
          if (response.status === 200 && response.resultObject?.data?.length > 0) {
            setRows(response.resultObject.data);
          }
        }
      } catch (error) {
        showToast(error.message, false);
      }
    }
    return {
        rows,
        columns,
        navigate,
        setRows,
        handleDelete,
        handleChangeStatus
    }
}