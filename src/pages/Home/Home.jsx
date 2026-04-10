import React, { useRef, useCallback } from "react";
import usePosts from "../../Javascript/usePosts";
import { fetchFeedPosts } from "../../Javascript/feedPosts";
import UserPosts from "../../components/Profile/UserPosts";
import PostCreateCard from "../../components/Post/PostCreateCard";

export default function Home() {
  const { posts, isLoadingPosts, setPosts, hasMore, loadMorePosts } =
    usePosts(fetchFeedPosts);

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

  return (
    <>
    <div className="space-y-6 pt-6">
       <PostCreateCard />
      
            <UserPosts posts={posts} loading={false} />

      <div
        ref={lastPostElementRef}
        className="h-10 flex justify-center items-center"
      >
        {isLoadingPosts && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-gray-400 text-sm italic">
            No more Posts
          </p>
        )}
      </div>
    </div>
    </>
  );
}
