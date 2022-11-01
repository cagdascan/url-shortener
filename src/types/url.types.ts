import type { DateFromISOStringC } from "io-ts-types/lib/DateFromISOString";

export interface CreateRequest {
  longUrl: string;
  customAlias?: string;
  expireAt?: DateFromISOStringC;
}

export interface CreateRequestErrors {
  longUrl?: string;
  customAlias?: string;
  expireAt?: DateFromISOStringC;
}
