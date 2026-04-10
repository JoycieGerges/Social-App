import { useState, useEffect, useContext } from "react";
import { getUserPosts } from "./UserPosts";
import { UserContext } from "../App";

export default function useUserPosts() {
  const { userData } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    if (userData?._id) {
      setIsLoadingPosts(true);
      getUserPosts(userData._id)
        .then((res) => {
          setPosts(res.data.posts);
        })
        .catch((err) => {
          console.error("Error:", err);
        })
        .finally(() => {
          setIsLoadingPosts(false);
        });
    }
  }, [userData]);

  return { posts, isLoadingPosts };
}
