import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, '') || '';
const base_url = `${apiBaseUrl}/auth`;

const loginUser = async (login: any) => {
  const res = await axios.post(`${base_url}/login`, login);
  return res.data;
};

export { loginUser };

