import axios from "axios";

export const deleteComment = async (postId, commentId) => {
  return axios.delete(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
};