import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const getBaseURL = () => {
  // Prioritize the backend API URL (removing '/api' suffix if present)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.endsWith("/api")
      ? process.env.NEXT_PUBLIC_API_URL.slice(0, -4)
      : process.env.NEXT_PUBLIC_API_URL;
  }
  // Fallback to NEXT_PUBLIC_BASE_URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Fallback to current browser origin if in the browser
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        photo: { type: "string" },
      },
    }),
  ],
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => {
        if (typeof window !== "undefined") {
          return localStorage.getItem("renterty_token") || "";
        }
        return "";
      }
    },
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) {
        localStorage.setItem("renterty_token", token);
      }
    },
  },
});

export const { signUp, signIn, signOut, useSession } = authClient;