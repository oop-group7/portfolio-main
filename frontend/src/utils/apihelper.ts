import createClient from "openapi-fetch";
import { components, paths } from "./api";

type AuthResponse = components["schemas"]["JwtResponse"];

export const { GET, POST } = createClient<paths>({
  baseUrl: window.location.origin,
  credentials: "same-origin",
  fetch: async (input, init) => {
    if (init) {
      const userData = getUserData();
      init.headers = userData
        ? {
            Authorization: `Bearer ${userData.accessToken}`,
          }
        : {};
    }
    let res = await fetch(input, init);
    const isLogin = input.toString().includes("/api/auth/signin");
    const midRes = await middleware(res, isLogin);
    if (midRes === "repeat") {
      res = await fetch(input, init);
    }
    return res;
  },
});

async function middleware(
  res: Response,
  isLogin: boolean
): Promise<"repeat" | "done"> {
  if (res.status === 401) {
    let userData = getUserData();
    if (userData === null) {
      window.location.href = "/";
    } else {
      const res = await POST("/api/auth/refresh", {
        body: {
          refreshToken: userData.refreshToken,
        },
      });
      if (res.data) {
        userData = {
          ...userData,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        return "repeat";
      } else {
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
  }
  if (isLogin && res.ok) {
    const authRes: AuthResponse = await res.json();
    localStorage.setItem("user", JSON.stringify(authRes));
  }
  return "done";
}

export function getUserData(): AuthResponse | null {
  const data = localStorage.getItem("user");
  return data && JSON.parse(data);
}

export function logout() {
  localStorage.removeItem("user");
  window.location.href = "/";
}
