import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import { useEffect, useState } from "react";

import CommentSection from "./CommentSection";

import type { TComment } from "../types/TComment";
import type { MediaItem, PostAuthor } from "../types/TPost";
import { enqueueSnackbar } from "notistack";

interface PostCardProps {
  author: PostAuthor;
  content: string;
  media?: MediaItem[];
  postId: string;
  comments: TComment[];
  likes: number;
  isSaved?: boolean;
  createdAt?: string;
  onAddComment: (postId: string, comment: string) => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (postId: string, newContent: string) => void;
  onLikePost: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  canManage: boolean;
}

const PostCard = ({
  author,
  content,
  media,
  postId,
  comments,
  likes,
  isSaved = false,
  onLikePost,
  onAddComment,
  onDeletePost,
  onEditPost,
  onToggleSave,
  createdAt,
  canManage,
}: PostCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showComments, setShowComments] = useState(false);

  const authorName = `${author.name?.first ?? ""} ${
    author.name?.last ?? ""
  }`.trim();

  const avatarUrl =
    author.avatar?.url ??
    `https://i.pravatar.cc/150?u=${author._id ?? authorName}`;

  const firstImage = media?.find((item) => item.type === "image") ?? media?.[0];

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleDelete = () => {
    if (!canManage) return;
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDeletePost(postId);
    }
  };

  const handleAddComment = (targetPostId: string, commentText: string) => {
    onAddComment(targetPostId, commentText);
  };

  const handleShare = async () => {
    const displayName = authorName || "Unknown";
    const shareText = `${displayName}: ${content}`;

    if (typeof navigator === "undefined") {
      return;
    }

    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
      clipboard?: { writeText?: (text: string) => Promise<void> };
    };

    try {
      if (nav.share) {
        await nav.share({
          title: "Shared Post",
          text: shareText,
          url: window.location.href,
        });
      } else if (nav.clipboard?.writeText) {
        await nav.clipboard.writeText(shareText);
        enqueueSnackbar("Post copied to clipboard", { variant: "info" });
      } else {
        enqueueSnackbar("Sharing is not supported in this browser.", {
          variant: "warning",
        });
      }
    } catch (error) {
      enqueueSnackbar("Failed to share the post", { variant: "error" });
    }
  };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : new Date().toLocaleString();
  return (
    <>
      <Card
        sx={{
          my: 2,
          boxShadow: 1,
          backgroundColor: "#fff",
          transition: "0.3s",
          "&:hover": { boxShadow: 1, transform: "none !important" },
        }}
      >
        <CardHeader
          avatar={
            <Avatar src={avatarUrl} alt={authorName || "Avatar"}>
              {(author.name?.first ?? "U").charAt(0)}
            </Avatar>
          }
          title={authorName || "Unknown user"}
          subheader={formattedDate}
          titleTypographyProps={{ fontWeight: "bold", fontSize: 16 }}
        />
        <CardContent>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              sx={{ my: 1 }}
            />
          ) : (
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {content}
            </Typography>
          )}
        </CardContent>
        {firstImage?.url && (
          <Box
            component={"img"}
            src={firstImage.url}
            alt={firstImage.alt || "Post image"}
            sx={{
              width: "96%",
              maxHeight: 300,
              objectFit: "cover",
              mb: 1,
              display: "flex",
              justifyContent: "center",
              mx: "auto",
              borderRadius: 1,
            }}
          />
        )}
        <CardActions disableSpacing sx={{ px: 2 }}>
          <IconButton onClick={() => onLikePost(postId)}>
            <ThumbUpOffAltIcon />
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {likes} {likes === 1 ? "like" : "likes"}
          </Typography>
          <IconButton onClick={() => setShowComments((prev) => !prev)}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </Typography>

          <Box sx={{ marginLeft: "auto", display: "flex", gap: 1 }}>
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
            <IconButton onClick={() => onToggleSave(postId)}>
              {isSaved ? (
                <BookmarkIcon sx={{ color: "#1bbe3a" }} />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
            {canManage && (
              <IconButton onClick={handleDelete}>
                <DeleteOutlineIcon />
              </IconButton>
            )}
            {canManage && (
              <Button
                sx={{ color: "#1bbe3a" }}
                onClick={() => {
                  if (isEditing) {
                    onEditPost(postId, editedContent);
                  }
                  setIsEditing((prev) => !prev);
                }}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            )}
          </Box>
        </CardActions>
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <CommentSection
            postId={postId}
            comments={comments}
            onAddComment={handleAddComment}
          />
        </Collapse>
      </Card>
    </>
  );
};
export default PostCard;
