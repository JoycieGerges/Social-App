import axios from "axios";

export const deletePost = (postId) => {
  return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
};
