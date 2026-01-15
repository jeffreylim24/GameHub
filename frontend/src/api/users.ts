/**
 * @fileoverview API client for user operations.
 *
 * Handles CRUD operations for user accounts including:
 * - Creating new users (direct creation, not via auth flow)
 * - Fetching users with pagination
 * - Updating and deleting user accounts
 *
 * @module api/users
 * @see {@link User} for the user data structure
 * @see api/auth for authentication-related operations
 */

import axiosInstance from '@/lib/axios';
import type {
  User,
  RegisterRequest,
  UpdateUserRequest,
  GetUsersParams,
  PaginatedResponse,
} from '@/types';

/**
 * Creates a new user.
 * @param data - User creation data
 * @returns Created user with generated ID and timestamp
 * @throws {AxiosError} On validation or network errors
 */
export const createUser = async (data: RegisterRequest): Promise<User> => {
  const response = await axiosInstance.post<User>('/users', data);
  return response.data;
};

/**
 * Retrieves users with pagination.
 * @param params - Optional pagination parameters
 * @returns Paginated response with users and pagination metadata
 * @throws {AxiosError} On network errors
 */
export const getUsers = async (
  params?: GetUsersParams
): Promise<PaginatedResponse<User>> => {
  const response = await axiosInstance.get<PaginatedResponse<User>>('/users', {
    params,
  });
  return response.data;
};

/**
 * Retrieves a user by ID.
 * @param id - User ID
 * @returns User object
 * @throws {AxiosError} On network errors or if user not found (404)
 */
export const getUser = async (id: number): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${id}`);
  return response.data;
};

/**
 * Updates a user.
 * @param id - User ID
 * @param data - User update data
 * @returns Updated user object
 * @throws {AxiosError} On validation, network errors, or if user not found (404)
 */
export const updateUser = async (
  id: number,
  data: UpdateUserRequest
): Promise<User> => {
  const response = await axiosInstance.put<User>(`/users/${id}`, data);
  return response.data;
};

/**
 * Deletes a user.
 * @param id - User ID
 * @throws {AxiosError} On network errors or if user not found (404)
 */
export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
