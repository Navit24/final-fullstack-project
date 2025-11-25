import { API_ENDPOINT } from "../config/api";
import apiClient from "./apiClient";
import type { TUser } from "../types/TUser";

export interface AuthResult {
  user: TUser;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: {
    first: string;
    last: string;
  };
  phone: string;
  birthDate: string;
  email: string;
  password: string;
  avatar?: {
    url?: string;
    alt?: string;
  };
  address?: {
    country?: string;
    city?: string;
    street?: string;
    houseNumber?: number;
  };
}

export interface UpdateProfilePayload {
  name?: {
    first?: string;
    last?: string;
  };
  email?: string;
  phone?: string;
  password?: string;
  avatar?: {
    url?: string;
    alt?: string;
  };
  address?: {
    country?: string;
    city?: string;
    street?: string;
    houseNumber?: number;
  };
}

// Funtion login user
export const loginApi = async (
  credentials: LoginCredentials
): Promise<AuthResult> => {
  const response = await apiClient.post<AuthResult>(
    API_ENDPOINT.LOGIN,
    credentials
  );
  return response.data;
};

// Funtion register user
export const registerApi = async (
  payload: RegisterPayload
): Promise<AuthResult> => {
  await apiClient.post(API_ENDPOINT.REGISTER, payload);
  return await loginApi({ email: payload.email, password: payload.password });
};

// Funtion update profile
export const updateProfileApi = async (
  userId: string,
  payload: UpdateProfilePayload
): Promise<TUser> => {
  const response = await apiClient.put<TUser>(
    API_ENDPOINT.USER_BY_ID(userId),
    payload
  );
  return response.data;
};
