import React, { useState, useEffect } from "react";
import {
  MdPeople,
  MdEmail,
  MdFeed,
  MdBookmark,
  MdCameraAlt,
} from "react-icons/md";

export default function UserProfileCard({
  userData,
  postsCounter,
  onPhotoUpload,
}) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      if (onPhotoUpload) {
        onPhotoUpload(file);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="w-full">

      <div className="relative h-48 md:h-64 bg-linear-to-r from-[#1a202c] to-[#2d3748] rounded-t-[40px] z-0">
        <div className="absolute top-4 right-6 text-white/30 text-xs">
          <span className="cursor-pointer hover:text-white transition-all underline">
            Add cover
          </span>
        </div>
      </div>

      <div className="relative z-10 -mt-24 w-full pb-8">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-6 md:p-10 border border-gray-50">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
            <div className="flex items-center gap-6">
          
              <div className="group relative w-24 h-24 md:w-32 md:h-32 rounded-full border-[6px] border-white shadow-md overflow-hidden bg-white shrink-0 cursor-pointer">
                <img
                  src={
                    preview ||
                    userData?.photo ||
                    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                  }
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="profile"
                />

       
                <label
                  htmlFor="profile-upload"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  <MdCameraAlt className="text-white text-3xl md:text-4xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black text-[#1e293b]">
                  {userData?.name || "Fares Ali"}
                </h1>
                <p className="text-[#64748b] text-xl">
                  @{userData?.name?.split(" ")[0].toLowerCase() || "user"}
                </p>
                <div className="inline-flex items-center gap-2 bg-[#f0f7ff] text-[#0077ff] px-3 py-1 rounded-full text-[11px] font-bold border border-[#e0efff]">
                  <MdPeople className="text-sm" />
                  Route Posts member
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full lg:w-auto">
              <StatItem
                label="FOLLOWERS"
                value={userData?.followersCount || 0}
              />
              <StatItem
                label="FOLLOWING"
                value={userData?.followingCount || 0}
              />
              <StatItem
                label="BOOKMARKS"
                value={userData?.bookmarksCount || 0}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#f8fafc] rounded-3xl p-6 border border-gray-100 min-h-40">
              <h3 className="text-[#1e293b] font-bold text-sm mb-5 text-uppercase tracking-wider">
                About
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#64748b]">
                  <MdEmail className="text-lg text-[#0077ff]" />
                  <span className="text-sm font-medium">
                    {userData?.email || "faresali0045@gmail.com"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#64748b]">
                  <MdPeople className="text-lg text-[#0077ff]" />
                  <span className="text-sm font-medium italic">
                    Active on Route Posts
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <SideInfoItem
                icon={<MdFeed />}
                title="MY POSTS"
                value={postsCounter || 0}
                active
              />
              <SideInfoItem
                icon={<MdBookmark />}
                title="SAVED POSTS"
                value={userData?.bookmarksCount || 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex-1 lg:min-w-30 bg-white border border-gray-100 rounded-3xl p-4 flex flex-col items-center justify-center shadow-sm hover:border-[#0077ff]/30 transition-colors group">
      <span className="text-[10px] font-bold text-gray-400 tracking-tighter mb-1 uppercase group-hover:text-[#0077ff] transition-colors">
        {label}
      </span>
      <span className="text-2xl font-black text-[#1e293b]">{value}</span>
    </div>
  );
}

function SideInfoItem({ icon, title, value, active }) {
  return (
    <div
      className={`rounded-2xl p-4 border flex flex-col gap-1 transition-all cursor-pointer ${
        active
          ? "bg-white border-[#0077ff]/20 shadow-lg shadow-blue-500/5"
          : "bg-[#f8fafc] border-gray-100 hover:bg-white hover:border-[#0077ff]/20"
      }`}
    >
      <div
        className={`flex items-center gap-2 text-[10px] font-bold ${
          active ? "text-[#0077ff]" : "text-gray-500"
        }`}
      >
        <span className="text-base">{icon}</span>
        {title}
      </div>
      <div className="text-xl font-black text-[#1e293b]">{value}</div>
    </div>
  );
}
