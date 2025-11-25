export type TAvatar = {
  url?: string;
  alt?: string;
};

export type TAddress = {
  country?: string;
  city?: string;
  street?: string;
  houseNumber?: number;
};

export type TUserName = {
  first: string;
  last: string;
};

export type TUser = {
  _id?: string;
  name: TUserName;
  phone: string;
  birthDate?: string | null;
  email: string;
  avatar?: TAvatar;
  address?: TAddress;
  followers?: string[];
  following?: string[];
  savedPosts?: string[];
  role?: "user" | "admin";
  createdAt?: string;
  token?: string;
};
