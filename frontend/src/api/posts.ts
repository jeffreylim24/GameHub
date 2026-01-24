/**
 * @fileoverview API client for post operations.
 *
 * Handles CRUD operations for discussion posts including:
 * - Creating new posts within topics
 * - Fetching posts with pagination and filters (topic, category, platform)
 * - Updating and deleting posts
 *
 * @module api/posts
 * @see {@link Post} for the post data structure
 * @see {@link GetPostsParams} for available query filters
 */

import axiosInstance from '@/lib/axios';
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  GetPostsParams,
  PaginatedResponse,
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
 * @param params - Optional filters for topic_id, category, platform, and pagination
 * @returns Paginated response with posts and pagination metadata
 * @throws {AxiosError} On network errors
 */
export const getPosts = async (
  params?: GetPostsParams
): Promise<PaginatedResponse<Post>> => {
  const response = await axiosInstance.get<PaginatedResponse<Post>>('/posts', {
    params,
  });
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
 * @returns Promise resolving when the post is deleted
 * @throws {AxiosError} On network errors or if post not found (404)
 */
export const deletePost = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}`);
};
