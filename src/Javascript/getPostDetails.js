import axios from "axios";

export const getPostDetails = (id) => {
  const token = localStorage.getItem("userToken");

  return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
