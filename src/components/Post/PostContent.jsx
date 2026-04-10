import React, { useState, useEffect, useRef } from "react";
import {FaPaperPlane,FaThumbsUp,FaShare,FaRegCommentDots,FaCamera,FaTimes} from "react-icons/fa";
import {HiDotsVertical,HiOutlinePencilAlt,HiOutlineTrash} from "react-icons/hi";
import { BsBookmark, BsEye } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { toggleBookmark } from "../../Javascript/addRemoveBookmark";
import { addComment } from "../../Javascript/addComment";
import { likePost } from "../../Javascript/likePost";
import { deletePost } from "../../Javascript/deletePost";
import { updatePost } from "../../Javascript/updatePost";
import { deleteComment } from "../../Javascript/deleteComment";
import { updateComment } from "../../Javascript/updateComment";
import { addReply } from "../../Javascript/addReply";
import { fetchAllLikes } from "../../Javascript/allLikes";
import LikesModal from "./Likes";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({
  post,
  profileImg,
  userData,
  allComments,
  isSavedPage = false,
  onUnsave,
  onDeleteSuccess,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [isLiked, setIsLiked] = useState(
    post.likes?.some((user) =>
      user._id ? user._id === userData?._id : user === userData?._id
    )
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const [localComments, setLocalComments] = useState(allComments || []);
  const [localCommentsCount, setLocalCommentsCount] = useState(
    post.commentsCount || 0
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.body);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const editFileInputRef = useRef(null);

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);


  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");


  const [replyText, setReplyText] = useState({});
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");

  const userId = userData?._id || localStorage.getItem("userId");

  useEffect(() => {
    if (post.likes && userData?._id) {
      const checkLiked = post.likes.some((user) =>
        user._id ? user._id === userData._id : user === userData._id
      );
      setIsLiked(checkLiked);
    }
  }, [post.likes, userData?._id]);

  useEffect(() => {
    setLocalComments(allComments || []);
  }, [allComments]);

  useEffect(() => {
    setLocalCommentsCount(post.commentsCount || 0);
  }, [post.commentsCount]);

  // ─── Bookmark ────────────────────────────────────────────────
  function handleBookmark() {
    toggleBookmark(post._id)
      .then(() => {
        if (isSavedPage && onUnsave) onUnsave(post._id);
      })
      .catch((error) => console.error("Error toggling bookmark:", error));
  }

  // ─── Like ─────────────────────────────────────────────────────
  function handleLike() {
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    likePost(post._id).catch(() => {
      setIsLiked(wasLiked);
      setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    });
  }

  // ─── Comment image ────────────────────────────────────────────
  const handleImageClick = () => fileInputRef.current.click();

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Add Comment ──────────────────────────────────────────────
  const handleCommentSubmit = async () => {
    if (!commentText.trim() && !selectedImage) return;

    const contentToSend = commentText;
    const imageToSend = selectedImage;

    setCommentText("");
    removeImage();

    const formData = new FormData();
    if (contentToSend.trim()) formData.append("content", contentToSend);
    if (imageToSend) formData.append("image", imageToSend);

    try {
      const res = await addComment(post._id, formData);
      const newCommentFromApi = res.data.comment || res.data.data?.comment;

      if (!newCommentFromApi) throw new Error("API did not return comment");

      const safeComment = {
        ...newCommentFromApi,
        _id: newCommentFromApi._id || Date.now(),
        postId: post._id,
        commentCreator: newCommentFromApi?.commentCreator || {
          _id: userData?._id,
          name: userData?.name,
          photo: userData?.photo,
        },
      };

      setLocalComments((prev) => [safeComment, ...prev]);
      setLocalCommentsCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error adding comment:", err);
      setCommentText(contentToSend);
    }
  };

  // ─── Delete Post ──────────────────────────────────────────────
  function handleDelete(postId) {
    deletePost(postId)
      .then((res) => {
        if (onDeleteSuccess) onDeleteSuccess(postId);
      })
      .catch((err) => {
        console.error("Delete failed:", err.response?.data?.message || err.message);
      });
  }

  // ─── Update Post ──────────────────────────────────────────────
  const handleUpdateSubmit = async () => {
    const formData = new FormData();
    formData.append("body", editText);
    if (editImage) formData.append("image", editImage);

    try {
      const res = await updatePost(post._id, formData);
      post.body = editText;
      if (res.data.post?.image) post.image = res.data.post.image;

      setIsEditing(false);
      setEditImage(null);
      setEditPreview(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  // ─── Likes Modal ──────────────────────────────────────────────
  const handleShowLikes = async () => {
    setIsLikesModalOpen(true);
    setIsLoadingLikes(true);
    try {
      const res = await fetchAllLikes(post._id);
      setLikedByUsers(res.data?.data?.likes || []);
    } catch (err) {
      console.error("Failed to fetch likes", err);
    } finally {
      setIsLoadingLikes(false);
    }
  };

  // ─── Delete Comment ───────────────────────────────────────────
  function handleDeleteComment(commentId) {
    deleteComment(post._id, commentId)
      .then(() => {
        setLocalComments((prev) => prev.filter((c) => c._id !== commentId));
        setLocalCommentsCount((prev) => prev - 1);
      })
      .catch((err) => console.error("Delete comment error", err));
  }

  // ─── Edit Comment ─────────────────────────────────────────────
  function handleStartEdit(comment) {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.content);
  }

  function handleSaveEdit(commentId) {
    const comment = localComments.find((c) => c._id === commentId);
    if (!comment || !comment.postId) {
      console.error("Cannot edit: postId missing");
      return;
    }

    updateComment(comment.postId, comment._id, editCommentText)
      .then(() => {
        setLocalComments((prev) =>
          prev.map((c) =>
            c._id === commentId ? { ...c, content: editCommentText } : c
          )
        );
        setEditingCommentId(null);
      })
      .catch((err) => console.error("Edit comment error", err));
  }

  // ─── Add Reply ────────────────────────────────────────────────
  const handleReplySubmit = async (comment) => {
    if (!replyText[comment._id]?.trim()) return;

    const formData = new FormData();
    formData.append("content", replyText[comment._id]);

    try {
      const res = await addReply(post._id, comment._id, formData);
      const newReply = res.data.reply || res.data.data?.reply;

      if (!newReply) throw new Error("API did not return reply");

      setLocalComments((prev) =>
        prev.map((c) =>
          c._id === comment._id
            ? {
                ...c,
                replies: [
                  ...(c.replies || []),
                  { ...newReply, postId: post._id },
                ],
              }
            : c
        )
      );

      setReplyText((prev) => ({ ...prev, [comment._id]: undefined }));
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  // ─── Update Reply ─────────────────────────────────────────────
  const handleReplyUpdate = (replyId, commentId) => {
    setLocalComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? {
              ...c,
              replies: c.replies.map((r) =>
                r._id === replyId ? { ...r, content: editReplyText } : r
              ),
            }
          : c
      )
    );
    setEditReplyId(null);
  };

  // ─── Delete Reply ─────────────────────────────────────────────
  const handleReplyDelete = (replyId, commentId) => {
    setLocalComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? { ...c, replies: c.replies.filter((r) => r._id !== replyId) }
          : c
      )
    );
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 w-full relative">
            <img
              className="rounded-full w-10 h-10 border border-gray-100 object-cover"
              src={post.user?.photo || profileImg}
              alt="User"
            />
            <div className="flex-1">
              <h3 className="text-md font-bold text-[#364153]">
                {post.user?.name}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {post.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })
                  : "Just now"}
              </p>
            </div>

         
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <HiDotsVertical size={20} className="rotate-90" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20 animate-fade-in">
                    <button
                      onClick={() => {
                        handleBookmark();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <BsBookmark
                        className={isSavedPage ? "text-red-400" : "text-gray-400"}
                      />
                      {isSavedPage ? "Unsave Post" : "Save Post"}
                    </button>

                    {post.user?._id === userId && (
                      <>
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setIsEditing(true);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                        >
                          <HiOutlinePencilAlt className="text-gray-400" size={18} />
                          Edit Post
                        </button>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            handleDelete(post._id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                        >
                          <HiOutlineTrash className="text-red-400" size={18} />
                          Delete Post
                        </button>
                      </>
                    )}

                    {!isSavedPage && (
                      <>
                        <div className="h-px bg-gray-100 my-1" />
                        <NavLink
                          to={`/PostDetails/${post._id}`}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                        >
                          <BsEye className="text-gray-400" /> View Details
                        </NavLink>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

       
        {isEditing ? (
          <div className="mb-6 space-y-4">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-30 text-[#4b5563] bg-gray-50"
              placeholder="What's on your mind?"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={() => editFileInputRef.current.click()}
                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
              >
                <FaCamera /> Change Image
              </button>
              <input
                type="file"
                ref={editFileInputRef}
                onChange={handleEditFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            {(editPreview || post.image) && (
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border">
                <img
                  src={editPreview || post.image}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                {editPreview && (
                  <button
                    onClick={() => {
                      setEditImage(null);
                      setEditPreview(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(post.body);
                  setEditPreview(null);
                }}
                className="px-5 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#4b5563] text-lg mb-6 wrap-break-word whitespace-pre-wrap overflow-hidden">
              {post.body}
            </p>
            {post.image && (
              <div className="w-full h-80 mb-6 rounded-2xl overflow-hidden border border-gray-100">
                <img
                  src={post.image}
                  alt="post content"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </>
        )}

       
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <span className="bg-blue-500 text-white p-1.5 rounded-full text-[10px] border-2 border-white shadow-sm">
                <FaThumbsUp />
              </span>
            </div>
            <span
              onClick={handleShowLikes}
              className="text-gray-500 text-sm font-medium cursor-pointer hover:underline hover:text-blue-600 transition-all"
            >
              {likesCount} likes
            </span>
          </div>
          <div className="flex flex-row">
            <span className="flex items-center gap-0.5 text-gray-500 text-sm font-medium me-2.5">
              <span>{post.sharesCount || 0}</span>
              <BiRepost className="text-lg" />
              <span>shares</span>
            </span>
            <span className="text-gray-500 text-sm font-medium">
              {localCommentsCount} comments
            </span>
          </div>
        </div>

       
        <div className="grid grid-cols-3 gap-2 py-1 mb-4">
          <button
            onClick={handleLike}
            className={`flex justify-center items-center gap-2 py-2.5 rounded-xl transition-all font-semibold ${
              isLiked
                ? "text-blue-600 bg-blue-50"
                : "text-[#6a7282] hover:bg-gray-50"
            }`}
          >
            <AiOutlineLike className={`text-lg ${isLiked ? "text-blue-600" : ""}`} />
            <span>Like</span>
          </button>
          <button className="flex justify-center items-center gap-2 py-2.5 text-[#6a7282] hover:bg-gray-50 rounded-xl transition-all font-semibold">
            <FaRegCommentDots className="text-lg" /> <span>Comment</span>
          </button>
          <button className="flex justify-center items-center gap-2 py-2.5 text-[#6a7282] hover:bg-gray-50 rounded-xl transition-all font-semibold">
            <FaShare className="text-lg" /> <span>Share</span>
          </button>
        </div>

        
        <div className="space-y-4 pt-4 border-t border-gray-50">

         
          {localComments && localComments.length > 0 ? (
            <div className="space-y-4 mb-4">
              {localComments.map((comment, index) => (
                <div key={comment?._id || index} className="flex gap-3 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                    <img
                      src={comment?.commentCreator?.photo || profileImg}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    
                    <div className="bg-[#F3F5F7] p-3 rounded-2xl rounded-tl-none">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-slate-800">
                          {comment?.commentCreator?.name || "User"}
                        </h4>
                        {comment?.commentCreator?._id === userId && (
                          <div className="flex gap-2">
                            <HiOutlinePencilAlt
                              className="cursor-pointer text-gray-400 hover:text-blue-500"
                              onClick={() => handleStartEdit(comment)}
                            />
                            <HiOutlineTrash
                              className="cursor-pointer text-gray-400 hover:text-red-500"
                              onClick={() => handleDeleteComment(comment._id)}
                            />
                          </div>
                        )}
                      </div>

                      {editingCommentId === comment._id ? (
                        <div className="mt-2">
                          <input
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="w-full border rounded-lg px-2 py-1 text-sm"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleSaveEdit(comment._id)}
                              className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="text-xs bg-gray-300 px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 mt-1">{comment?.content}</p>
                      )}

                 
                      <div className="mt-1 text-xs">
                        <button
                          onClick={() =>
                            setReplyText((prev) => ({
                              ...prev,
                              [comment._id]:
                                prev[comment._id] !== undefined ? undefined : "",
                            }))
                          }
                          className="text-blue-500 hover:underline"
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                   
                    {replyText[comment._id] !== undefined && (
                      <div className="flex items-center gap-2 mt-2 ml-4">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText[comment._id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [comment._id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleReplySubmit(comment)
                          }
                          className="flex-1 border rounded-lg px-2 py-1 text-sm"
                        />
                        <button
                          onClick={() => handleReplySubmit(comment)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Send
                        </button>
                      </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-4 mt-2 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="flex gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                              <img
                                src={reply.commentCreator?.photo || profileImg}
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="bg-gray-100 p-2 rounded-xl flex-1">
                              {editReplyId === reply._id ? (
                                <div>
                                  <input
                                    type="text"
                                    value={editReplyText}
                                    onChange={(e) =>
                                      setEditReplyText(e.target.value)
                                    }
                                    className="w-full border rounded px-2 py-1 text-sm mb-1"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleReplyUpdate(reply._id, comment._id)
                                      }
                                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditReplyId(null)}
                                      className="bg-gray-300 text-black px-2 py-1 rounded text-xs"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm font-semibold">
                                    {reply.commentCreator?.name}
                                  </p>
                                  <p className="text-sm">{reply.content}</p>
                                  {reply.commentCreator?._id === userId && (
                                    <div className="flex gap-2 mt-1 text-xs">
                                      <button
                                        onClick={() => {
                                          setEditReplyId(reply._id);
                                          setEditReplyText(reply.content);
                                        }}
                                        className="text-blue-500 hover:underline"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleReplyDelete(reply._id, comment._id)
                                        }
                                        className="text-red-500 hover:underline"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
         
            post.topComment && (
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                  <img
                    src={post.topComment?.commentCreator?.photo}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 bg-[#F3F5F7] p-3 rounded-2xl rounded-tl-none">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-800">
                      {post.topComment?.commentCreator?.name || "User"}
                    </h4>
                    {post.topComment?.commentCreator?._id === userId && (
                      <div className="flex gap-2">
                        <HiOutlinePencilAlt
                          className="cursor-pointer text-gray-400 hover:text-blue-500"
                          onClick={() => handleStartEdit(post.topComment)}
                        />
                        <HiOutlineTrash
                          className="cursor-pointer text-gray-400 hover:text-red-500"
                          onClick={() => handleDeleteComment(post.topComment._id)}
                        />
                      </div>
                    )}
                  </div>
                  {editingCommentId === post.topComment._id ? (
                    <div className="mt-2">
                      <input
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full border rounded-lg px-2 py-1 text-sm"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSaveEdit(post.topComment._id)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="text-xs bg-gray-300 px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 mt-1">
                      {post.topComment?.content}
                    </p>
                  )}
                  {post.topComment?.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 max-w-xs">
                      <img
                        src={post.topComment.image}
                        className="w-full h-auto"
                        alt="comment"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          
          {previewUrl && (
            <div className="relative w-24 h-24 ml-10 mb-2 rounded-lg overflow-hidden border border-blue-200 shadow-sm">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <FaTimes size={10} />
              </button>
            </div>
          )}

          
          <div className="flex items-center gap-2 pt-3 mt-1 border-t border-gray-100">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <img
                src={userData?.photo || profileImg}
                alt="me"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                placeholder="Write a comment..."
                className="w-full bg-[#f0f2f5] border-none rounded-full py-1.5 px-4 pr-12 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <FaCamera
                  onClick={handleImageClick}
                  className={`cursor-pointer text-xs ${
                    selectedImage ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
                  }`}
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() && !selectedImage}
                  className={`p-1.5 rounded-full transition-all ${
                    commentText.trim() || selectedImage
                      ? "text-blue-500 hover:bg-blue-50 scale-110"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <FaPaperPlane
                    size={14}
                    className={commentText.trim() || selectedImage ? "rotate-45" : ""}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LikesModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        likes={likedByUsers}
        isLoading={isLoadingLikes}
      />
    </>
  );
}