import axios from "axios";

const API_URL = "https://route-posts.routemisr.com/users/bookmarks";
export const getBookmarks = async () => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
  });
};
