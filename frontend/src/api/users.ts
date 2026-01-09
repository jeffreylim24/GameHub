/**
 * API service for user operations.
 * @module
 */

import axiosInstance from '@/lib/axios';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/types';

/**
 * Creates a new user.
 * @param data - User creation data
 * @returns Created user with generated ID and timestamp
 * @throws {AxiosError} On validation or network errors
 */
export const createUser = async (data: CreateUserRequest): Promise<User> => {
  const response = await axiosInstance.post<User>('/users', data);
  return response.data;
};

/**
 * Retrieves all users.
 * @returns Array of all users
 * @throws {AxiosError} On network errors
 */
export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>('/users');
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
