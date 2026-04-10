import axios from "axios";

export const fetchAllLikes = async (postId) => {
  return axios.get(`https://route-posts.routemisr.com/posts/${postId}/likes`, {
    params: {
      page: 1,
      limit: 20,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
};
