import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import { createBranch, fetchByIdBranch, updateBranch } from "service/branch.service";
import { useCityEffect } from "service/hooks/useCityEffect.hooks";

import { showToast } from "utils/helper";

export const useBranchAddEdit = () => {
    const [id, setId] = useState(null);

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

    const navigate = useNavigate();
    const { pathname } = useLocation();
    
    const { cityList } = useCityEffect();

    const getBranchById = useCallback(async (id) => {
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
    }, [reset]);

    const handleSave = async (info) => {
        if (id) {
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
    
    useEffect(() => {
      if (pathname.includes("edit")) {
        const splitData = pathname.split("/");
        if (splitData.length === 4) {
          setId(splitData[3]);
          getBranchById(splitData[3]);
        }
      }
      return () => false;
    }, [pathname, getBranchById, setId]);
    return {
        id,
        cityList,
        control,
        navigate,
        handleSubmit,
        handleSave,
    }
}