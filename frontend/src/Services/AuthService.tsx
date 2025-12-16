import axios from "axios";

const base_url = `${process.env.REACT_APP_API_BASE_URL}/auth`;

const loginUser = async (login: any) => {
  const res = await axios.post(`${base_url}/login`, login);
  return res.data;
};

export { loginUser };

