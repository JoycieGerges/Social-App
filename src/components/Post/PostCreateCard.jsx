import React, { useState, useContext, useRef } from "react";
import { FaImage, FaPaperPlane, FaLightbulb, FaTimes } from "react-icons/fa";
import { UserContext } from "../../App";
import { AddPost } from "../../Javascript/createPost";
import { LuLoader } from "react-icons/lu";

export default function PostCreateCard() {
  const { userData } = useContext(UserContext);
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    fileInputRef.current.value = "";
  };

  const handlePostSubmit = () => {
    if (!postContent.trim() && !selectedImage) return;

    setIsLoading(true);

    const formData = new FormData();
    if (postContent.trim()) formData.append("body", postContent);
    if (selectedImage) formData.append("image", selectedImage);

    AddPost(formData)
      .then((res) => {
        console.log("Success:", res.data);
        setPostContent("");
        removeImage();
      })
      .catch((err) => {
        console.error("Error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
     
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
          <img
            src={userData?.photo}
            alt={userData?.name || "user"}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-slate-800 font-bold text-lg leading-tight">
            Create a Post
          </h3>
          <p className="text-slate-400 text-sm">
            Share your thoughts, {userData?.name?.split(" ")[0] || "User"}
          </p>
        </div>
      </div>
      <div className="relative">
        <textarea
          rows="2"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-[#F3F5F7] text-slate-600 rounded-2xl p-6 pt-8 outline-none border border-transparent focus:border-blue-200 transition-all resize-none"
        />

        {postContent && postContent.length < 3 && (
          <small className="absolute top-2 right-4 text-xs text-red-400 animate-pulse">
            Post must be at least 3 characters
          </small>
        )}

      </div>

      {previewUrl && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-100">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-gray-800/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={handleImageClick}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaImage
            className={selectedImage ? "text-blue-500" : "text-slate-600"}
          />
          <span className="text-[#364153] font-medium">
            {selectedImage ? "Change Photo" : "Photo"}
          </span>
        </button>

        <button
          onClick={handlePostSubmit}
          disabled={isLoading || (!postContent.trim() && !selectedImage)}
          className="flex items-center gap-3 px-6 py-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-400 text-white font-bold hover:shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-30 justify-center"
        >
          {isLoading ? (
            <>
              <span className="animate-pulse flex flex-row items-center gap-2">
                Posting
                <LuLoader />
              </span>
            </>
          ) : (
            <>
              <span>Post</span>
              <FaPaperPlane className="text-sm" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
