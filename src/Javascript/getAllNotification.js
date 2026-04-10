import axios from "axios";

export const fetchNotifications = () => {
  return axios.get(
    `https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
};
