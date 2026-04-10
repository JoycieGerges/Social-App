import axios from "axios";

export const toggleFollow = (userId) => {
  return axios.put(
    `https://route-posts.routemisr.com/users/${userId}/follow`,
    {},
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    },
  );
};
