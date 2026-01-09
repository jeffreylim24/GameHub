/**
 * API service for post operations.
 * @module
 */

import axiosInstance from '@/lib/axios';
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  GetPostsParams,
} from '@/types';

/**
 * Creates a new post.
 * @param data - Post creation data
 * @returns Created post with generated ID and timestamps
 * @throws {AxiosError} On validation or network errors
 */
export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  const response = await axiosInstance.post<Post>('/posts', data);
  return response.data;
};

/**
 * Retrieves posts ordered by creation date (newest first).
 * @param params - Optional filters for topic_id, category, and platform
 * @returns Array of posts with preloaded author and topic information
 * @throws {AxiosError} On network errors
 */
export const getPosts = async (params?: GetPostsParams): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>('/posts', { params });
  return response.data;
};

/**
 * Retrieves a post by ID.
 * @param id - Post ID
 * @returns Post object with preloaded author and topic information
 * @throws {AxiosError} On network errors or if post not found (404)
 */
export const getPost = async (id: number): Promise<Post> => {
  const response = await axiosInstance.get<Post>(`/posts/${id}`);
  return response.data;
};

/**
 * Updates a post.
 * @param id - Post ID
 * @param data - Post update data
 * @returns Updated post object
 * @throws {AxiosError} On validation, network errors, or if post not found (404)
 */
export const updatePost = async (
  id: number,
  data: UpdatePostRequest
): Promise<Post> => {
  const response = await axiosInstance.put<Post>(`/posts/${id}`, data);
  return response.data;
};

/**
 * Deletes a post.
 * @param id - Post ID
 * @throws {AxiosError} On network errors or if post not found (404)
 */
export const deletePost = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}`);
};
