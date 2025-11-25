import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import PostCard from "../../components/PostCard";
import {
  removePost,
  updatePost,
  likePostAsync,
  toggleSavePostAsync,
  addCommentAsync,
} from "../../store/postSlice";
import { useCallback, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { updateProfile } from "../../store/userSlice";
import { getSavedPostsApi } from "../../services/postService";
import type { TPost } from "../../types/TPost";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const posts = useSelector((state: RootState) => state.posts.posts);
  const dispatch = useDispatch<AppDispatch>();
  const [editOpen, setEditOpen] = useState(false);
  const [firstName, setFirstName] = useState(user?.name.first ?? "");
  const [lastName, setLastName] = useState(user?.name.last ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [activeTab, setActiveTab] = useState<"my" | "saved">("my");
  const [savedFeed, setSavedFeed] = useState<TPost[]>([]);
  const savedPostIds = useSelector(
    (state: RootState) => state.posts.savedPosts
  );

  useEffect(() => {
    if (user) {
      setFirstName(user.name.first ?? "");
      setLastName(user.name.last ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);
  if (!user) {
    return (
      <Container sx={{ mt: 12 }}>
        <Typography variant="h6" align="center">
          Not logged in, please log in to view.
        </Typography>
      </Container>
    );
  }

  const userPosts = posts?.filter((post) => post.author?._id === user._id);

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error && error.message ? error.message : fallback;

  const handleSave = async () => {
    try {
      await dispatch(
        updateProfile({
          name: { first: firstName, last: lastName },
          email,
        })
      ).unwrap();
      enqueueSnackbar("Profile updated", { variant: "success" });
      setEditOpen(false);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to update profile";
      enqueueSnackbar(message, { variant: "error" });
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
    const wasSaved = savedPostIds.includes(postId);
    try {
      await dispatch(toggleSavePostAsync(postId)).unwrap();
      enqueueSnackbar(
        wasSaved ? "Post removed from saved posts" : "Post saved successfully",
        {
          variant: "success",
        }
      );
      if (activeTab === "saved") {
        fetchSaved();
      }
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Failed to toggle save"), {
        variant: "error",
      });
    }
  };

  const fetchSaved = useCallback(async () => {
    try {
      const posts = await getSavedPostsApi();
      setSavedFeed(posts);
    } catch (error) {
      enqueueSnackbar("Failed to load saved posts", { variant: "error" });
    }
  }, []);

  useEffect(() => {
    if (activeTab === "saved") {
      fetchSaved();
    }
  }, [activeTab, fetchSaved]);

  const handleAddComment = async (postId: string, comment: string) => {
    try {
      await dispatch(addCommentAsync({ postId, text: comment })).unwrap();
      enqueueSnackbar("Comment added", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Failed to add comment"), {
        variant: "error",
      });
    }
  };

  return (
    <Container sx={{ mt: 12 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          sx={{ width: 80, height: 80 }}
          src={
            user.avatar?.url ??
            `https://i.pravatar.cc/150?u=${user._id ?? "profile"}`
          }
        />
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{ mt: 4 }}
        >
          <Tab value="my" label="My posts" />
          <Tab value="saved" label="Saved posts" />
        </Tabs>
        <Box>
          <Typography variant="h5">
            {user.name.first} {user.name.last}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setEditOpen(true)}
          sx={{ color: "#1bbe3a", borderColor: "#1bbe3a" }}
        >
          Edit Profile
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        My posts
      </Typography>

      {activeTab === "my" ? (
        userPosts?.length ? (
          userPosts.map((post) => {
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
                createdAt={post.createAt}
                isSaved={savedPostIds.includes(post._id)}
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
          <Typography variant="body2">
            You haven't posted anything yet.
          </Typography>
        )
      ) : savedFeed.length ? (
        savedFeed.map((post) => {
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
              createdAt={post.createAt}
              isSaved={savedPostIds.includes(post._id)}
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
        <Typography variant="body2">No saved posts yet.</Typography>
      )}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <Box>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
