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
  IconButton,
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
import { useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const posts = useSelector((state: RootState) => state.posts.posts);
  const dispatch = useDispatch<AppDispatch>();
  const [editOpen, setEditOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.name.first ?? "",
    lastName: user?.name.last ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    birthDate: user?.birthDate
      ? new Date(user.birthDate).toISOString().slice(0, 10)
      : "",
    country: user?.address?.country ?? "",
    city: user?.address?.city ?? "",
    street: user?.address?.street ?? "",
    houseNumber: user?.address?.houseNumber ?? "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatar?.url
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<"my" | "saved">("my");
  const [savedFeed, setSavedFeed] = useState<TPost[]>([]);
  const savedPostIds = useSelector(
    (state: RootState) => state.posts.savedPosts
  );

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.name.first ?? "",
        lastName: user.name.last ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        birthDate: user.birthDate
          ? new Date(user.birthDate).toISOString().slice(0, 10)
          : "",
        country: user?.address?.country ?? "",
        city: user?.address?.city ?? "",
        street: user?.address?.street ?? "",
        houseNumber: user?.address?.houseNumber ?? "",
      });
      setAvatarPreview(user?.avatar?.url);
      setAvatarFile(null);
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
      let avatarPayload = user?.avatar;
      if (avatarFile && avatarPreview) {
        avatarPayload = {
          url: avatarPreview,
          alt: avatarFile.name,
        };
      }
      await dispatch(
        updateProfile({
          name: {
            first: profileForm.firstName,
            last: profileForm.lastName,
          },
          email: profileForm.email,
          phone: profileForm.phone,
          address: {
            country: profileForm.country,
            city: profileForm.city,
            street: profileForm.street,
            houseNumber: profileForm.houseNumber
              ? Number(profileForm.houseNumber)
              : undefined,
          },
          avatar: avatarPayload,
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

  const updateProfileField =
    (field: keyof typeof profileForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileForm((prev) => ({ ...prev, [field]: event.target.value }));
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{ width: 120, height: 120, borderRadius: 1 }}
            src={avatarPreview}
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                setAvatarFile(file);
                setAvatarPreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            }}
          />
        </Box>
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
            {" "}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              <Box sx={{ position: "relative", width: 100, height: 140 }}>
                {" "}
                <Avatar
                  sx={{ width: 140, height: 140, border: "3px solid #1bbe3a" }}
                  src={avatarPreview}
                />{" "}
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  size="medium"
                  sx={{
                    position: "absolute",
                    top: "70%",
                    right: -40,
                    bgcolor: "rgb(187, 180, 180)",
                    color: "#000",
                    "&:hover": { bgcolor: "rgb(180, 172, 172)" },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>{" "}
              </Box>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setAvatarFile(file);
                    setAvatarPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </Box>
            <TextField
              label="First Name"
              value={profileForm.firstName}
              onChange={updateProfileField("firstName")}
            />
            <TextField
              label="Last Name"
              value={profileForm.lastName}
              onChange={updateProfileField("lastName")}
            />
            <TextField
              label="Email"
              value={profileForm.email}
              onChange={updateProfileField("email")}
            />
            <TextField
              label="Phone"
              value={profileForm.phone}
              onChange={updateProfileField("phone")}
            />
            <TextField
              label="Birth Date"
              type="date"
              value={profileForm.birthDate}
              onChange={updateProfileField("birthDate")}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Country"
              value={profileForm.country}
              onChange={updateProfileField("country")}
            />
            <TextField
              label="City"
              value={profileForm.city}
              onChange={updateProfileField("city")}
            />
            <TextField
              label="Street"
              value={profileForm.street}
              onChange={updateProfileField("street")}
            />
            <TextField
              label="House Number"
              type="number"
              value={profileForm.houseNumber}
              onChange={updateProfileField("houseNumber")}
            />
          </DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} sx={{ color: "#1bbe3a" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: "#1bbe3a" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
