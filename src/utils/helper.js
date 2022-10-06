import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // eslint-disable-next-line

export const Loading = () => {
  <Box sx={{ display: 'flex' }}>
    <CircularProgress />
  </Box>
}

export const getFormData = (object) => {
  const formData = new FormData();
  Object.keys(object).forEach(key => formData.append(key, object[key]));
  return formData;
}

export const isEmpty = (value) => {
  return typeof value === "undefined" || value === "" || value === null;
};

export const replaceUrlVariable = (url, params) => {
  const regex = /[^{{}]+(?=}})/g;
  const matches = url.match(regex);
  let modifiedURL = url;
  if (matches) {
    matches.forEach((item) => {
      const value = params[item];
      modifiedURL = modifiedURL.replace(
        new RegExp("{{" + item + "}}"),
        !isEmpty(value) || value === "" ? value : `{{${item}}}`
      );
    });
  }
  return modifiedURL;
};

export const showToast = (Message, status) => {
  if (status) {
    toast.success(Message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  } else {
    toast.error(Message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  }
};
