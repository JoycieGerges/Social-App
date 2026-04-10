import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostDetails } from "../../Javascript/getPostDetails";
import PostCard from "../../components/Post/PostContent";
import PostSkeleton from "../../components/Post/PostPlaceHolder";
import { useContext } from "react";
import { UserContext } from "../../App";
import { fetchComments } from "../../Javascript/comments";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(UserContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setLoading(true);
    getPostDetails(id)
      .then((res) => {
        setPost(res.data.data.post);
      })
      .catch((err) => {
        console.error("Error fetching post details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchComments(id)
        .then((res) => {
          console.log("Comments:", res.data.data.comments);
          setComments(res.data.data.comments);
        })
        .catch((err) => console.log(err));
    }
  }, [id]);

  return (
    <div className="max-w-full mx-auto">
      {loading ? (
        <PostSkeleton />
      ) : post ? (
        <PostCard post={post} userData={userData} allComments={comments} />
      ) : (
        <div className="text-center py-10 text-gray-500">
          Post not found or has been deleted.
        </div>
      )}
    </div>
  );
}
