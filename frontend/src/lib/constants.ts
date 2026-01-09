export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const API_TIMEOUT_MS =
  Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

export const IS_DEV = import.meta.env.DEV;
