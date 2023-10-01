import createClient from "openapi-fetch";
import { components, paths } from "./api";
import { atom, computed } from "nanostores";

type AuthResponse = components["schemas"]["JwtResponse"];

const userData = atom<AuthResponse | undefined>();

export const client = computed(userData, (currentToken) =>
  createClient<paths>({
    baseUrl: window.location.origin,
    credentials: "same-origin",
    headers: currentToken
      ? { Authorization: `Bearer ${currentToken.accessToken}` }
      : {},
    fetch: async (input, init) => {
      let res = await fetch(input, init);
      const isLogin = input.toString().includes("/api/auth/signin");
      const midRes = await middleware(res, isLogin);
      if (midRes === "repeat") {
        res = await fetch(input, init);
      }
      return res;
    },
  })
);

async function middleware(
  res: Response,
  isLogin: boolean
): Promise<"repeat" | "done"> {
  if (res.status === 401) {
    const lUserData = userData.get();
    if (lUserData === undefined) {
      window.location.href = "/";
    } else {
      const res = await client.get().POST("/api/auth/refresh", {
        body: {
          refreshToken: lUserData.refreshToken,
        },
      });
      if (res.data) {
        userData.set({
          ...lUserData,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        });
        return "repeat";
      } else {
        window.location.href = "/";
      }
    }
  }
  if (isLogin && res.ok) {
    const authRes: AuthResponse = await res.json();
    userData.set(authRes);
  }
  return "done";
}

export function getUserData() {
  return userData.get();
}

export function logout() {
  userData.set(undefined);
  window.location.href = "/";
}
