import createClient from "openapi-fetch";
import { components, paths } from "./api";

type AuthResponse = components["schemas"]["JwtResponse"];

let userData: AuthResponse | undefined = undefined;

const baseClient = createClient<paths>({
  baseUrl: window.location.origin,
});

export const { GET, POST } = new Proxy(baseClient, {
  get(_, key: keyof typeof baseClient) {
    const newClient = createClient<paths>({
      credentials: "same-origin",
      headers: userData
        ? { Authorization: `Bearer ${userData.accessToken}` }
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
    });
    return newClient[key];
  },
});

async function middleware(
  res: Response,
  isLogin: boolean
): Promise<"repeat" | "done"> {
  if (res.status === 401) {
    if (userData === undefined) {
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
        return "repeat";
      } else {
        window.location.href = "/";
      }
    }
  }
  if (isLogin && res.ok) {
    const authRes: AuthResponse = await res.json();
    userData = authRes;
  }
  return "done";
}

export function getUserData() {
  return userData;
}

export function logout() {
  userData = undefined;
  window.location.href = "/";
}
