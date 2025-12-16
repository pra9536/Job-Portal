import axios from "axios";

const base_url = `${import.meta.env.VITE_API_BASE_URL}/auth`;

const loginUser = async (login: any) => {
  const res = await axios.post(`${base_url}/login`, login);
  return res.data;
};

export { loginUser };

