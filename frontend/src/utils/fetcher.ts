import { AuthenticationService, OpenAPI } from "../generated";
import { RegisterRequest } from "../types/Authentication";

OpenAPI.CREDENTIALS = "same-origin";
OpenAPI.BASE = window.location.origin;

const ACCESS_TOKEN_KEY = "accessToken";
/**Throws an error on request fail. Remember to catch it.
 * If you are not expecting to get any output, use `setter()` instead.
 * If you are not going to pass any JSON body in your request, leave the `TResponse` generic, and the `body` field as undefined.
 */
export async function fetcher<
  TRequest extends object | undefined,
  TResponse extends object
>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body: TRequest
): Promise<TResponse> {
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 403) {
    window.location.href = "/";
  }
  if (!res.ok) {
    throw Error();
  }
  const json = (await res.json()) as TResponse;
  return json;
}

function getAuthHeader(): {} | { Authorization: string } {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken === null) {
    return {};
  } else {
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }
}

/**Throws an error on request fail. Remember to catch it.
 * If you are expecting to get an output, use `getter()` instead.
 * If you are not going to pass any JSON body in your request, leave the `TResponse` generic, and the `body` field as undefined.
 */
export async function setter<TRequest extends object | undefined>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body: TRequest
) {
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 403) {
    window.location.href = "/";
  }
  if (!res.ok) {
    throw Error();
  }
}

/**
 * Sign in to the website
 * Authenticates a user with the provided login credentials and returns a JWT token upon successful authentication.
 * @returns JwtResponse Successful sign in
 * @throws ApiError
 */
export async function login(email: string, password: string) {
  const res = await AuthenticationService.authenticateUser({
    requestBody: {
      email,
      password,
    },
  });
  OpenAPI.TOKEN = res.token;
  return res;
}

export function logout() {
  OpenAPI.TOKEN = undefined;
}

// Export a function to get the access token from localStorage
export function ifLogin() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**Throws an error on request failure, remember to catch it. */
export async function register(
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  password: string
) {
  await setter<RegisterRequest>("/api/auth/signup", "POST", {
    firstName,
    lastName,
    userName,
    email,
    password,
    roles: ["user"],
  });
}

//Password reset
export async function resetPassword(email: string) {
  const resetUrl = `/api/auth/forgotpassword?email=${encodeURIComponent(
    email
  )}`;
  const res = await fetch(resetUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
}
