import axios from "axios";

const API_URL = "https://route-posts.routemisr.com/users/change-password";

export function changePassword(data) {
  return axios
    .patch(
      API_URL,
      {
        password: data.password,
        newPassword: data.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      },
    )
    .then((response) => response.data)
    .catch((error) => {
      console.log("Detailed API Error:", error.response?.data);
      throw error.response?.data || { message: "Server error" };
    });
}
