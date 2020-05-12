export type Provider = "google" | "facebook" | "instagram";

export interface storageConfig {
  key: string;
}

export interface Authentication {
  jwt: string;
  user: Object;
}
