import axios from "axios";

export const toggleBookmark = async (postId) => {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
};
