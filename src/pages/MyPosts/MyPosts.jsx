import React, { useContext } from "react";
import PostCreateCard from "../../components/Post/PostCreateCard";
import UserPosts from "../../components/Profile/UserPosts";
import { UserContext } from "../../App";
import ProfileImg from "../../assets/Images/defaultProfile.png";
import useUserPosts from "../../Javascript/useUserPosts";


export default function MyPosts() {
  const { userData } = useContext(UserContext);
  const { posts, isLoadingPosts } = useUserPosts();

  return (
    <div className="space-y-6">
      <PostCreateCard userImg={userData?.photo || ProfileImg} />
      <UserPosts posts={posts} loading={isLoadingPosts} />
    </div>
  );
}
