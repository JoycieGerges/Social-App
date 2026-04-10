import axios from "axios";

const API_URL = "https://route-posts.routemisr.com/users";


export const fetchUserData = () => {
  const token = localStorage.getItem("userToken");

  return axios
    .get(`${API_URL}/profile-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data || { error: "Server error" };
    });
};
