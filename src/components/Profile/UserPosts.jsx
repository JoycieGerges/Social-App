import { IoNewspaper } from "react-icons/io5";
import profileImg from "../../assets/Images/defaultProfile.png";
import { useContext, useMemo } from "react";
import { UserContext } from "../../App";
import PostCard from "../Post/PostContent";
import PostSkeleton from "../Post/PostPlaceHolder";

export default function UserPosts({ posts, loading }) {
  const { userData } = useContext(UserContext);

  const uniquePosts = useMemo(() => {
    if (!posts) return [];
    const seen = new Set();
    return posts.filter((post) => {
      const duplicate = seen.has(post._id);
      seen.add(post._id);
      return !duplicate;
    });
  }, [posts]);

  return (
    <>
  
      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-md border p-6 border-gray-100 lg:col-span-2 mb-6 flex flex-row items-center">
        <IoNewspaper className="text-[#99A1AF] text-xl" />
        <h1 className="font-bold text-lg text-[#1e2939] ms-2">My Posts</h1>
      </div>

    
      {loading ? (
        <div className="space-y-6 lg:col-span-2">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : uniquePosts.length > 0 ? (
        uniquePosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            profileImg={profileImg}
            userData={userData}
          />
        ))
      ) : (
        <div className="lg:col-span-2 text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <IoNewspaper className="text-4xl opacity-20" />
            <p>No posts shared yet.</p>
          </div>
        </div>
      )}
    </>
  );
}
