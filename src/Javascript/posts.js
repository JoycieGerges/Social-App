const API_URL = "https://route-posts.routemisr.com/posts";
import axios from "axios";

export const fetchPosts = (page = 1) => {
  const token = localStorage.getItem("userToken");
  return axios
    .get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page,
        limit: 20,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response?.data || { error: "Server error" };
    });
};
