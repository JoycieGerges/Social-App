import axios from "axios";

export const getUserPosts = (userId, limit = 2) => {
  const url = `https://route-posts.routemisr.com/users/${userId}/posts`;

  return axios
    .get(url, {
      params: { limit: limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("API Error Detail:", error.response?.data || error.message);
      throw error;
    });
};
