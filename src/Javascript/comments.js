import axios from "axios";

export const fetchComments = async (postId) => {
  return axios.get(
    `https://route-posts.routemisr.com/posts/${postId}/comments`,
    {
      params: {
        page: 1,
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
};
