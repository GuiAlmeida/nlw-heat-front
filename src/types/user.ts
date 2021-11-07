import {  ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

export type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

export type AuthProviderType = {
  children: ReactNode;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  };
};
