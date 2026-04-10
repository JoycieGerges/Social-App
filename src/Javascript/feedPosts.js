import axios from "axios";

const API_URL = "https://route-posts.routemisr.com/posts";

export const fetchFeedPosts = (page = 1) => {
  return axios
    .get(`${API_URL}/feed?only=following&limit=10&page=${page}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("API Error Detail:", error.response?.data || error.message);
      throw error;
    });
};
