import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import profileImg from "../../assets/Images/HomeImgs/defaultProfile.png";
import { fetchFeedPosts } from "../../services/feedPosts";
import PostCreateCared from "./PostCreateCard";
import PostCard from "./PostContent";
import PostSkeleton from "./PostPlaceHolder";
import { UserContext } from "../../App";

export default function Post() {
  const { userData, setUserData } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: "fetch-error", theme: "colored" });
    }
  }, [error]);

  useEffect(() => {
    const msg = location.state?.successMsg;
    if (msg) {
      toast.success(msg, { toastId: "login-success", theme: "colored" });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchFeedPosts()
      .then((res) => {
        setPosts(res.posts);
        console.log(res.data.data);

        setIsLoadingPosts(false);
      })
      .catch((err) => {
        setError(err.message || "Posts fetch failed");
      })
      .finally(() => {
        setIsLoadingPosts(false);
      });
  }, []);

  return (
    <>
      <div className="lg:col-span-2 col-span-1 space-y-6">
        <PostCreateCared userData={userData} />
        <div className="space-y-4">
          <h2 className="text-[#6a7282] text-xl font-semibold px-2">
            Latest Posts
          </h2>

          {isLoadingPosts ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} profileImg={profileImg} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
