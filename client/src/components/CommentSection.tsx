import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { TComment } from "../types/TComment";
import ForumIcon from "@mui/icons-material/Forum";

interface CommentSectionProps {
  postId: string;
  comments: TComment[];
  onAddComment: (postId: string, comment: string) => void;
}
const CommentSection = ({
  postId,
  comments,
  onAddComment,
}: CommentSectionProps) => {
  const [draft, setDraft] = useState("");

  const handleAddComment = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    onAddComment(postId, trimmed);
    setDraft("");
  };

  return (
    <Box sx={{ m: 2 }}>
      <Divider
        sx={{
          my: 2,
          borderBottomWidth: 1,
        }}
      />
      <List dense>
        {comments.length > 0 ? (
          comments.map((item) => (
            <Box
              key={item._id}
              sx={{
                mb: 3,
                position: "relative",
                pl: 6,
              }}
            >
              <Avatar
                src={
                  item.user?.avatar?.url ??
                  `https://i.pravatar.cc/150?u=${item.user?._id ?? "user"}`
                }
                alt={`${item.user?.name?.first ?? "User"} ${
                  item.user?.name?.last ?? ""
                }`}
                sx={{
                  width: 40,
                  height: 40,
                  position: "absolute",
                  left: 0,
                  top: 5,
                  transform: "translateY(-10%)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              />
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: "#f5f5f5",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Typography fontWeight="bold">
                  {item.user?.name?.first ?? "Unknown"}{" "}
                  {item.user?.name?.last ?? ""}
                </Typography>

                <Typography>{item.text}</Typography>
              </Paper>
            </Box>
          ))
        ) : (
          <Box textAlign="center" color="gray" mt={4}>
            <ForumIcon fontSize="large" sx={{ mb: 1 }} />
            <Typography variant="body1" fontWeight="bold">
              No comments yet
            </Typography>
            <Typography variant="body2">
              You can write the first comment
            </Typography>
          </Box>
        )}
      </List>
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <TextField
          size="small"
          label="add comment"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          disabled={!draft.trim()}
          sx={{ flexShrink: 0, bgcolor: "#1bbe3a" }}
        >
          Add Comment
        </Button>
      </Box>
    </Box>
  );
};
export default CommentSection;
