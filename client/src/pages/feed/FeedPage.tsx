import { Box, Container, Typography } from "@mui/material";

import type { AppDispatch, RootState } from "../../store/index";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  createPost as createPostAsync,
  removePost,
  updatePost,
  likePostAsync,
  toggleSavePostAsync,
  addCommentAsync,
} from "../../store/postSlice";
import { useEffect } from "react";

import PostCard from "../../components/PostCard";
import NewPostForm from "../../components/NewPostForm";

import { enqueueSnackbar } from "notistack";

type feedPageProps = {
  searchTerm: string;
};

const FeedPage = ({ searchTerm }: feedPageProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user.user);
  const posts = useSelector((state: RootState) => state.posts.posts);
  const savedPosts = useSelector((state: RootState) => state.posts.savedPosts);
  const isLoading = useSelector((state: RootState) => state.posts.isLoading);
  const error = useSelector((state: RootState) => state.posts.error);


  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const authorName = `${post.author?.name?.first ?? ""} ${
      post.author?.name?.last ?? ""
    }`.toLowerCase();

    return (
      post.content.toLowerCase().includes(normalizedSearch) ||
      authorName.includes(normalizedSearch)
    );
  });

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [error]);

  const getErrorMessage = (err: unknown, fallback: string) =>
    err instanceof Error && err.message ? err.message : fallback;


  const handleAddPost = async (content: string, image?: string) => {
    try {
      const media = image
        ? [
            {
              url: image,
              alt: "post image",
              type: "image" as const,
            },
          ]
        : undefined;
      await dispatch(createPostAsync({ content, media })).unwrap();
      enqueueSnackbar("Post created successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Failed to create post"), {
        variant: "error",
      });
    }
  };


  const handleAddComment = async (postId: string, comment: string) => {
    if (!user) {
      enqueueSnackbar("You must be logged in to comment", {
        variant: "warning",
      });
      return;
    }
    try {
      await dispatch(addCommentAsync({ postId, text: comment })).unwrap();
      enqueueSnackbar("Comment added", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Failed to add comment"), {
        variant: "error",
      });
    }
  };


  const handleDeletePost = async (postId: string) => {
    try {
      await dispatch(removePost(postId)).unwrap();
      enqueueSnackbar("Post deleted", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Failed to delete post"), {
        variant: "error",
      });
    }
  };


  const handleEditPost = async (postId: string, newContent: string) => {
    try {
      await dispatch(
        updatePost({ id: postId, data: { content: newContent } })
      ).unwrap();
      enqueueSnackbar("Post updated", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Failed to update post"), {
        variant: "error",
      });
    }
  };


  const handleLikePost = async (postId: string) => {
    try {
      await dispatch(likePostAsync(postId)).unwrap();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Failed to like post"), {
        variant: "error",
      });
    }
  };

 
  const handleToggleSave = async (postId: string) => {
    const wasSaved = savedPosts.includes(postId);
    try {
      await dispatch(toggleSavePostAsync(postId)).unwrap();
      enqueueSnackbar(
        wasSaved ? "Post removed from saved posts" : "Post saved successfully",
        {
          variant: "success",
        }
      );
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Failed to toggle save"), {
        variant: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f5f5f5 0%, #e3f2fd 100%)",
        pt: 6,
        pb: 6,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ display: "flex", flexDirection: "column" }}>

          <NewPostForm onAddPost={handleAddPost} />

          {isLoading && posts.length === 0 ? (
            <Typography variant="body2" align="center">
              Loading posts...
            </Typography>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const canManage =
                user?.role === "admin" || post.author?._id === user?._id;
              return (
                <PostCard
                  key={post._id}
                  author={post.author}
                  content={post.content}
                  media={post.media}
                  postId={post._id}
                  comments={post.comments}
                  likes={post.likes.length}
                  isSaved={savedPosts.includes(post._id)}
                  createdAt={post.createAt}
                  onAddComment={handleAddComment}
                  onDeletePost={handleDeletePost}
                  onEditPost={handleEditPost}
                  onLikePost={handleLikePost}
                  onToggleSave={handleToggleSave}
                  canManage={canManage}
                />
              );
            })
          ) : (
            <Typography variant="body2" align="center">
              No posts found.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default FeedPage;
