import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { FiUsers, FiUserPlus } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { getFollowSuggestions } from "../../Javascript/getFollowSuggestions";
import { toggleFollow } from "../../Javascript/followUsers";

export default function FollowSuggest() {
  const [users, setUsers] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getFollowSuggestions(100)
      .then((response) => {
        setUsers(response.data.data.suggestions);
        console.log(response, "follow");
      })
      .catch((error) => {
        console.error("Error fetching follow suggestions:", error);
      });
  }, []);

  const handleFollow = (userId) => {
    setLoadingIds((prev) => [...prev, userId]);

    toggleFollow(userId)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === userId ? { ...u, isFollowed: true } : u,
          ),
        );
      })
      .catch((error) => {
        console.error("Follow failed", error);
      })
      .finally(() => {
        setLoadingIds((prev) => prev.filter((id) => id !== userId));
      });
  };
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="hidden lg:block lg:col-span-1 h-fit sticky top-10">
        <div className="space-y-4">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
            <h2 className="text-[#364153] font-bold text-lg mb-6 flex items-center gap-2">
              <FiUsers className="text-blue-500" />
              <span>Suggested Friends</span>
            </h2>
            <div className="mb-3">
              <label className="relative block">
                <CiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />

                <input
                  placeholder="Search friends..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#1877f2] focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </div>

            <div className="space-y-6">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-11 h-11 rounded-full object-cover border border-gray-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-[#1e2939] text-sm truncate">
                          {user.name}
                        </h4>
                        <p className="text-xs text-[#6a7282] font-normal truncate">
                          {user.username ? `@${user.username}` : "Route User"}
                        </p>
                        <div className="flex flex-col gap-2 mt-1">
                          <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <span className="font-bold text-gray-500">
                              {user.followersCount}
                            </span>
                            followers
                          </p>

                          {user.mutualFollowersCount > 0 && (
                            <p className="text-[9px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-bold shadow-xs whitespace-nowrap w-fit">
                              {user.mutualFollowersCount} Mutual
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => !user.isFollowed && handleFollow(user._id)}
                      disabled={
                        loadingIds.includes(user._id) || user.isFollowed
                      }
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                        user.isFollowed
                          ? "bg-blue-600 border-blue-600 text-white cursor-default"
                          : "border-blue-500 text-blue-500 hover:bg-blue-50"
                      } ${loadingIds.includes(user._id) ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {loadingIds.includes(user._id) ? (
                        <>
                          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                          Following...
                        </>
                      ) : user.isFollowed ? (
                        <>
                          <FaCheck size={10} />
                          Followed
                        </>
                      ) : (
                        <>
                          <FiUserPlus />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm italic">
                  Loading suggestions...
                </p>
              )}
            </div>

            <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
              View more
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
