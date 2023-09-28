export type SignInResponse = {
  id: string;
  username: string;
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
  firstName: string;
  lastName: string,
  userName: string,
  password: string;
  email: string;
  roles: ("user" | "dev")[];
};

export type RegisterResponse = {
  message: string;
};
