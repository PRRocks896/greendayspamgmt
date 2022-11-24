import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // eslint-disable-next-line

export const convertDate = (passingDate) => {
  const formattedDate = new Date(passingDate);
  const fullYear = formattedDate.getFullYear();
  const month = formattedDate.getMonth() + 1;
  const date = formattedDate.getDate();
  const hour = formattedDate.getHours() > 9 ? formattedDate.getHours() : '0' +formattedDate.getHours();
  const minutes = formattedDate.getMinutes() > 9 ? formattedDate.getMinutes() : '0' + formattedDate.getMinutes();
  const seconds = formattedDate.getSeconds() > 9 ? formattedDate.getSeconds() : '0' + formattedDate.getSeconds();
  return `${fullYear}-${month}-${date}T${hour}:${minutes}:${seconds}.000Z`
}
export const confirmationBox = (msg) => {
  return window.confirm(msg);
}

export const Loading = () => {
  <Box sx={{ display: 'flex' }}>
    <CircularProgress />
  </Box>
}

export const getRoleId = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return userData?.roleID || null;
}

export const getUserData = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return userData;
}

export const isAdmin = () => {
  return getRoleId() === 1 ? true : false;
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
