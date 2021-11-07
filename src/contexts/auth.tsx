import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { User, AuthContextData, AuthProviderType, AuthResponse } from "@/types/user";

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthProviderType) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=0227b4388024a09ff267`;

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>("authenticate", {
      code: githubCode,
    });

    const { token, user } = response.data;
    
    localStorage.setItem("token", token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("token");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>("profile").then(response => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("?code=");

      window.history.pushState({}, "", urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return <AuthContext.Provider value={{ signInUrl, user, signOut }}>{props.children}</AuthContext.Provider>;
}
