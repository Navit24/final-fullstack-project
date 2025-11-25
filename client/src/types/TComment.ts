export interface CommentAuthor {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  avatar?: {
    url: string;
    alt: string;
  };
}

export interface TComment {
  _id: string;
  user: CommentAuthor;
  text: string;
  createAt: string;
}
