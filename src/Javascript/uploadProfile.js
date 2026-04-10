import axios from "axios";

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return axios.put(
    "https://route-posts.routemisr.com/users/upload-photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        token: localStorage.getItem("userToken"),
      },
    },
  );
};
