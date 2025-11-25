import { Avatar, Box, Button, IconButton, TextField } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { enqueueSnackbar } from "notistack";

interface NewPostFormProps {
  onAddPost: (content: string, image?: string) => void;
  onClose?: () => void;
}

const NewPostForm = ({ onAddPost, onClose }: NewPostFormProps) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user);

  const MAX_SIZE_MB = 5;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      enqueueSnackbar("Please select an image file only JPG/PNG/WebP format", {
        variant: "warning",
      });
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      enqueueSnackbar(`Image size must be less than ${MAX_SIZE_MB}MB`, {
        variant: "warning",
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.onerror = () => {
      enqueueSnackbar("Failed to read image file", { variant: "error" });
      return;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    onAddPost(content.trim(), image || undefined);
    setContent("");
    setImage(null);
    if (onClose) {
      onClose();
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mb: 7,
        p: 3,
        borderRadius: 1,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <Box display="flex" alignItems="flex-start" gap={2}>
        <Avatar
          src={user?.avatar?.url}
          alt={`${user?.name?.first ?? "User"} ${user?.name?.last ?? ""}`}
          sx={{ width: 48, height: 48 }}
        />
        <TextField
          label="what are you thinking?"
          multiline
          rows={3}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="share your thoughts with the community..."
        />
      </Box>
      <Button
        component="label"
        sx={{
          mb: 2,
          color: "#1bbe3a",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        Upload Photo{" "}
        <AddPhotoAlternateIcon
          sx={{
            ml: 1,
          }}
        />
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          hidden
          onChange={handleImageChange}
        />
      </Button>
      {image && (
        <Box sx={{ mb: 2, position: "relative", display: "inline-block" }}>
          <img
            src={image}
            alt="preview"
            style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
          />
          <IconButton
            size="small"
            onClick={() => setImage(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      <Button
        type="submit"
        variant="contained"
        disabled={!content.trim()}
        sx={{ width: "100%", bgcolor: "#1bbe3a" }}
      >
        Post
      </Button>
    </Box>
  );
};

export default NewPostForm;
