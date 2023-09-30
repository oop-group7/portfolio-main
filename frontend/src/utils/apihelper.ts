import { AuthenticationService, OpenAPI } from "../generated";

OpenAPI.CREDENTIALS = "same-origin";
OpenAPI.BASE = window.location.origin;

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

export function isCurrentlyLoggedIn() {
  return OpenAPI.TOKEN !== undefined;
}
