import { parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";
import { recoverUser, signInRequest } from "./authTest";
import Router from "next/router";

interface User {
  name: string;
  email: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthContextInterface {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextInterface);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "kyoka-token": token } = parseCookies();

    if (token) {
      recoverUser().then((response) => {
        setUser(response.user);
      });
    }
  }, []);

  async function signIn({ email, password }: SignInData) {
    const { token } = await signInRequest({
      email,
      password,
    });

    setCookie(undefined, "kyoka-token", token, {
      maxAge: 60 * 60 * 24, //1 day
    });

    setUser(user);

    Router.push("/home");
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}
