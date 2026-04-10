import axios from "axios";

export const addComment = async (postId, formData) => {
  return axios.post(
    `https://route-posts.routemisr.com/posts/${postId}/comments`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
};
