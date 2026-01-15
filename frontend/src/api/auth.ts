/**
 * @fileoverview API client for authentication operations.
 *
 * Handles user authentication including:
 * - User registration
 * - User login
 * - Current user session retrieval
 *
 * @module api/auth
 * @see {@link User} for the user data structure
 * @see {@link AuthResponse} for authentication response format
 */

import axiosInstance from '@/lib/axios';
import type { RegisterRequest, LoginRequest, AuthResponse, User } from '@/types';

/**
 * Registers a new user account.
 * @param data - Registration credentials (username)
 * @returns Authentication response with user data and session token
 * @throws {AxiosError} On validation errors (e.g., username taken) or network failures
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
  return response.data;
};

/**
 * Authenticates an existing user.
 * @param data - Login credentials (username)
 * @returns Authentication response with user data and session token
 * @throws {AxiosError} On invalid credentials or network failures
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
  return response.data;
};

/**
 * Retrieves the currently authenticated user's profile.
 * @returns Current user's data
 * @throws {AxiosError} On unauthorized (401) if no valid session, or network failures
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/auth/me');
  return response.data;
};
