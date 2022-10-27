import axios from "axios";
import { endpoint } from "../utils/constant";

// THIS FUNCTION IS TO GET AND SET TOKENS
export const authHeader = () => {
  // return authorization header with basic auth credentials
  const user = localStorage.getItem("dataToken");
  // console.log("userTOKEnnn", user);

  if (user) {
    return { headers: { Authorization: `Bearer ${user}` } };
    // return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
};


// **************************************

export const getPDF = async (url) => {
  return axios(`${endpoint}${url}`, {
    method: 'GET',
    responseType: 'blob' //Force to receive data in a Blob Format
  })
  .then(response => {
    //Create a Blob from the PDF Stream
    const file = new Blob(
      [response.data], 
      {type: 'application/pdf'}
    );
    return URL.createObjectURL(file);
    //Build a URL from the file
    // const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    // window.open(fileURL);
  })
  .catch(error => {
    console.log(error);
  });
};

export const get = async (url) => {
  const response = await axios
    .get(`${endpoint}${url}`, authHeader())
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.error(err);
    });
  return response;
};

export const remove = async (url, data) => {
  const response = await axios
    .delete(`${endpoint}${url}`, data, authHeader())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
    });
  return response;
};

export const patch = async (url, data) => {
  return await axios
    .patch(`${endpoint}${url}`, data, authHeader())
    .then((res) => {
      if (res.status === 200) {
        return res;
        // if (res.data.success) {
        //   return res.data.data.list ? res.data.data.list : res.data;
        // } else {
        //   return [];
        // }
      } else {
        return [];
      }
    })
    .catch((err) => {
      // return err?.response?.data;
    });
};

export const post = async (url, data) => {
  return await axios
    .post(`${endpoint}${url}`, data, authHeader())
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.error(err);
      return err.response.data;
    });
};

export const put = async (url, data) => {
  return await axios
    .put(`${endpoint}${url}`, data, authHeader())
    .then((res) => {
      if (res.status === 200) {
        return res;
        // if (res.data.success) {
        //   return res.data.data.list ? res.data.data.list : res.data;
        // } else {
        //   return [];
        // }
      } else {
        return [];
      }
    })
    .catch((err) => {
      return err.response.data;
    });
};
