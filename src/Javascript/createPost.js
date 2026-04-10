import axios from "axios";

export const AddPost = (postData) => {
  return axios.post("https://route-posts.routemisr.com/posts", postData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
};
