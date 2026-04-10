import axios from "axios";

export function updateComment(postId, commentId, content) {
  const formData = new FormData();
  formData.append("content", content);

  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
}