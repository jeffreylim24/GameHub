/**
 * @fileoverview API client for topic (game) operations.
 *
 * Handles CRUD operations for game topics including:
 * - Creating new game topics
 * - Fetching topics with pagination
 * - Updating and deleting topics
 *
 * Topics represent games that can be discussed in the forum.
 *
 * @module api/topics
 * @see {@link Topic} for the topic data structure
 */

import axiosInstance from '@/lib/axios';
import type {
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
  GetTopicsParams,
  PaginatedResponse,
} from '@/types';

/**
 * Creates a new topic.
 * @param data - Topic creation data
 * @returns Created topic with generated ID and timestamps
 * @throws {AxiosError} On validation or network errors
 */
export const createTopic = async (data: CreateTopicRequest): Promise<Topic> => {
  const response = await axiosInstance.post<Topic>('/topics', data);
  return response.data;
};

/**
 * Retrieves topics ordered by creation date (newest first).
 * @param params - Optional pagination parameters
 * @returns Paginated response with topics and pagination metadata
 * @throws {AxiosError} On network errors
 */
export const getTopics = async (
  params?: GetTopicsParams
): Promise<PaginatedResponse<Topic>> => {
  const response = await axiosInstance.get<PaginatedResponse<Topic>>('/topics', {
    params,
  });
  return response.data;
};

/**
 * Retrieves a topic by ID.
 * @param id - Topic ID
 * @returns Topic object with preloaded creator information
 * @throws {AxiosError} On network errors or if topic not found (404)
 */
export const getTopic = async (id: number): Promise<Topic> => {
  const response = await axiosInstance.get<Topic>(`/topics/${id}`);
  return response.data;
};

/**
 * Updates a topic.
 * @param id - Topic ID
 * @param data - Topic update data
 * @returns Updated topic object
 * @throws {AxiosError} On validation, network errors, or if topic not found (404)
 */
export const updateTopic = async (
  id: number,
  data: UpdateTopicRequest
): Promise<Topic> => {
  const response = await axiosInstance.put<Topic>(`/topics/${id}`, data);
  return response.data;
};

/**
 * Deletes a topic.
 * @param id - Topic ID
 * @returns Promise resolving when the topic is deleted
 * @throws {AxiosError} On network errors or if topic not found (404)
 */
export const deleteTopic = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/topics/${id}`);
};
