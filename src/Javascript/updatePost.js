import axios from "axios";

export const updatePost = (postId, formData) => {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
};
