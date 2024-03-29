export enum ErrorMode {
  Toast,
  Alert,
  None,
}

export type Provider = "google" | "facebook" | "instagram";

export interface storageConfig {
  key: string;
}

export interface Authentication {
  jwt: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  current_house: House;
  houses?: House[];
}

export interface House {
  id: number;
  name: string;
  list_at?: number;
  uuid?: string;
  users?: User[];
}

export class StoreConstants {
  public static readonly JWT = "jwt";
  public static readonly USER = "user";
}

export const RecipesCategories = {
  snack: "Apéritifs",
  appetizers: "Entrées",
  dish: "Plats",
  dessert: "Desserts",
  drink: "Boissons",
};
