import React, { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import usePosts from "../../Javascript/usePosts";
import { fetchPosts } from "../../Javascript/posts";
import UserPosts from "../../components/Profile/UserPosts";
import PostCreateCard from "../../components/Post/PostCreateCard";

export default function Comunity() {
  const location = useLocation();

  const { posts, isLoadingPosts, hasMore, loadMorePosts } =
    usePosts(fetchPosts);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoadingPosts) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingPosts, hasMore, loadMorePosts],
  );


  useEffect(() => {
    const msg = location.state?.successMsg;
    if (msg) {
      toast.success(msg, { toastId: "login-success", theme: "colored" });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="space-y-6 pb-10">
      <PostCreateCard />

      <UserPosts posts={posts} loading={false} />

      <div
        ref={lastPostElementRef}
        className="h-10 flex justify-center items-center mt-4"
      >
        {isLoadingPosts && (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-400 text-sm">Loading more posts...</span>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="text-gray-400 text-sm italic font-medium bg-gray-50 px-4 py-2 rounded-full">
             You've reached the end of the community feed
          </p>
        )}
      </div>
    </div>
  );
}
