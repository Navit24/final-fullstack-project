import type { TComment } from "./TComment";

export interface MediaItem {
  url?: string;
  alt?: string;
  type: "image" | "video";
}

export interface PostAuthor {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  email?: string;
  avatar?: {
    url?: string;
    alt?: string;
  };
}

export interface TPost {
  _id: string;
  author: PostAuthor;
  content: string;
  media?: MediaItem[];
  likes: string[];
  createAt: string;
  updatedAt: string;
  comments: TComment[];
  isSaved?: boolean;
}
