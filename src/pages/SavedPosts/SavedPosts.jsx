import React, { useEffect, useState } from "react";
import PostCard from "../../components/Post/PostContent";
import { getBookmarks } from "../../Javascript/getBookmarks";
import { useContext } from "react";
import { UserContext } from "../../App";


export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useContext(UserContext);

  const removeItemFromUI = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  useEffect(() => {
    getBookmarks()
      .then((response) => {
        const savedData = response.data.data.bookmarks;
        setPosts(savedData || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching saved posts:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto ">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-[#364153]">Saved Posts</h2>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
          {posts.length}
        </span>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              userData={userData}
              isSavedPage={true}
              onUnsave={removeItemFromUI}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-medium">No saved posts found.</p>
        </div>
      )}
    </div>
  );
}
