import createClient from "openapi-fetch";
import { components, paths } from "./api";

type AuthResponse = components["schemas"]["JwtResponse"];

const LOCAL_STORAGE_USER_KEY = "user";

export const { GET, POST, DELETE, PUT } = createClient<paths>({
  baseUrl: window.location.origin,
  credentials: "same-origin",
  fetch: async (input, init) => {
    if (init) {
      const userData = getUserData();
      const extraAuthorizationHeaders: { Authorization: string } | {} = userData
        ? {
            Authorization: `Bearer ${userData.accessToken}`,
          }
        : {};
      const extraContentHeaders: { "Content-Type": string } | {} =
        init.method !== "GET"
          ? {
              "Content-Type": "application/json",
            }
          : {};
      init.headers = {
        ...extraAuthorizationHeaders,
        ...extraContentHeaders,
      };
    }
    let res = await fetch(input, init);
    const isLogin = input.toString().includes("/api/auth/signin");
    const isUpdateProfile = input.toString().includes("/updateprofile");
    const midRes = await middleware(res, isLogin);
    if (midRes === "repeat") {
      res = await fetch(input, init);
    }
    const userData = getUserData();
    if (isUpdateProfile && res.ok && userData) {
      const clonedRes = res.clone();
      const authRes: components["schemas"]["UpdateUserRequest"] =
        await clonedRes.json();
      setUserData({
        ...userData,
        ...authRes,
      });
    }
    return res;
  },
});

async function middleware(
  res: Response,
  isLogin: boolean
): Promise<"repeat" | "done"> {
  if (res.status === 401 || !isLogin) {
    let userData = getUserData();
    if (userData === null) {
      //window.location.href = "/";
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
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
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
        return "repeat";
      } else {
        window.location.href = "/";
      }
    }
  }
  if (isLogin && res.ok) {
    const clonedRes = res.clone();
    const authRes: AuthResponse = await clonedRes.json();
    setUserData(authRes);
  }
  return "done";
}

function setUserData(res: AuthResponse) {
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res));
}

export function getUserData(): AuthResponse | null {
  const data = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  return data && JSON.parse(data);
}

export function logout() {
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  window.location.href = "/";
}
