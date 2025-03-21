import { client } from "../../../api/index";

const API_BASE_URL = "https://jieavs-socialconnect.netlify.app";
// const API_BASE_URL = "http://localhost:3004";
////Logout
export const logOutUser = async (options) => {
  return await client.get(`${API_BASE_URL}/logOut`, options);
};

////Refresh
export const getRefresh = async (path, option) => {
  return await client.get(`${API_BASE_URL}/${path}`, option);
};

///Get Employees or Post
export const getData = async (path, option = null) => {
  const response = await client.get(`${API_BASE_URL}/${path}`, option);
  return response.data;
};
///update Employees or Post
export const putData = async (path, option) => {
  const response = await client.patch(`${API_BASE_URL}/${path}`, option);
  return response.data;
};

///update Employees or Post
export const postData = async (path, option) => {
  try {
    const response = await client.post(`${API_BASE_URL}/${path}`, option);
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const postFormData = async (path, data, option) => {
  const response = await client.post(`${API_BASE_URL}/${path}`, data, option);
  return response.data;
};
export const putFormData = async (path, data, option) => {
  const response = await client.patch(`${API_BASE_URL}/${path}`, data, option);
  return response.data;
};
