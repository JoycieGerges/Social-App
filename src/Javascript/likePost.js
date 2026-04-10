import axios from "axios";

export const likePost = (postId) => {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
};
