/**
 * @fileoverview API client for comment operations.
 *
 * Handles CRUD operations for post comments including:
 * - Creating new comments on posts
 * - Fetching comments with pagination (ordered oldest first for thread display)
 * - Updating and deleting comments
 *
 * @module api/comments
 * @see {@link Comment} for the comment data structure
 * @see {@link GetCommentsParams} for available query filters
 */

import axiosInstance from '@/lib/axios';
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  GetCommentsParams,
  PaginatedResponse,
} from '@/types';

/**
 * Creates a new comment.
 * @param data - Comment creation data
 * @returns Created comment with generated ID and timestamps
 * @throws {AxiosError} On validation or network errors
 */
export const createComment = async (
  data: CreateCommentRequest
): Promise<Comment> => {
  const response = await axiosInstance.post<Comment>('/comments', data);
  return response.data;
};

/**
 * Retrieves comments ordered by creation date (oldest first).
 * @param params - Optional filter for post_id and pagination
 * @returns Paginated response with comments and pagination metadata
 * @throws {AxiosError} On network errors
 */
export const getComments = async (
  params?: GetCommentsParams
): Promise<PaginatedResponse<Comment>> => {
  const response = await axiosInstance.get<PaginatedResponse<Comment>>(
    '/comments',
    { params }
  );
  return response.data;
};

/**
 * Retrieves a comment by ID.
 * @param id - Comment ID
 * @returns Comment object with preloaded author information
 * @throws {AxiosError} On network errors or if comment not found (404)
 */
export const getComment = async (id: number): Promise<Comment> => {
  const response = await axiosInstance.get<Comment>(`/comments/${id}`);
  return response.data;
};

/**
 * Updates a comment.
 * @param id - Comment ID
 * @param data - Comment update data
 * @returns Updated comment object
 * @throws {AxiosError} On validation, network errors, or if comment not found (404)
 */
export const updateComment = async (
  id: number,
  data: UpdateCommentRequest
): Promise<Comment> => {
  const response = await axiosInstance.put<Comment>(`/comments/${id}`, data);
  return response.data;
};

/**
 * Deletes a comment.
 * @param id - Comment ID
 * @returns Promise resolving when the comment is deleted
 * @throws {AxiosError} On network errors or if comment not found (404)
 */
export const deleteComment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/comments/${id}`);
};
