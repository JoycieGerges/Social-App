import axios from "axios";

export const addReply = async (postId, commentId, formData) => {
  return axios.post(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
};