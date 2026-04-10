import React, { useContext } from "react";
import UserProfileCard from "../../components/Profile/UserProfileCard";
import UserPosts from "../../components/Profile/UserPosts";
import Loading from "../Loading/Loading";
import useUserPosts from "../../Javascript/useUserPosts";
import { UserContext } from "../../App";
import { uploadProfilePhoto } from "../../Javascript/uploadProfile";
import { toast } from "react-toastify";

export default function Profile() {
  const { userData, setUserData } = useContext(UserContext);
  const { posts, isLoadingPosts } = useUserPosts();

  const handlePhotoUpload = (file) => {
    const toastId = toast.loading("Updating profile picture");

    uploadProfilePhoto(file)
      .then((res) => {
        console.log(res);

        if (res.data.success === true) {
          toast.update(toastId, {
            render: "Photo updated successfully! ",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          if (setUserData) {
            setUserData((prev) => ({ ...prev, photo: res.data.data.photo }));
          }
        }
      })
      .catch((err) => {
        console.error(err);
        toast.update(toastId, {
          render: "Failed to upload photo",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  if (isLoadingPosts) return <Loading />;

  return (
    <div className="lg:col-span-12 space-y-6">
      <UserProfileCard
        userData={userData}
        postsCounter={posts?.length || 0}
        onPhotoUpload={handlePhotoUpload}
      />
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="w-full">
          <UserPosts posts={posts} loading={isLoadingPosts} />
        </div>
      </div>
    </div>
  );
}
