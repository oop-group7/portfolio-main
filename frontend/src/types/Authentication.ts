export type SignInResponse = {
  id: string;
  email: string;
  roles: ("ROLE_USER" | "ROLE_DEVELOPER")[];
  accessToken: string;
  tokenType: "Bearer";
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  password: string;
  email: string;
  roles: ("user" | "dev")[];
};

export type RegisterResponse = {
  message: string;
};
