import { useState, useEffect, useCallback } from "react";

export default function usePosts(fetchFunction) {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = useCallback(() => {
    if (isLoadingPosts || !hasMore) return;

    setIsLoadingPosts(true);
    fetchFunction(page)
      .then((res) => {
        const postsData =
          res.posts || res.data?.posts || res.data?.data?.posts || [];

        if (postsData.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prev) => [...prev, ...postsData]);
          setPage((prev) => prev + 1);
        }
      })
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => setIsLoadingPosts(false));
  }, [page, isLoadingPosts, hasMore, fetchFunction]);

  useEffect(() => {
    loadMorePosts();
  }, []);
  return { posts, isLoadingPosts, setPosts, hasMore, loadMorePosts };
}
