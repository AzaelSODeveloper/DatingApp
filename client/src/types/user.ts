export type User = {
  id: number;
  displayName: string;
  token: string;
  email: string;
  imageUrl?: string;
}

export type LoginCreds = {
  email: string;
  password: string;
}

export type RegisterCreds = {
  displayName: string;
  email: string;
  password: string;
}
