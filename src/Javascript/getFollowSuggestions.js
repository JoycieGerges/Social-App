import axios from "axios";

const API_URL = "https://route-posts.routemisr.com/users/suggestions?limit=10";

export const getFollowSuggestions = async () => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
};
