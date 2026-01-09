/**
 * API service for topic operations.
 * @module
 */

import axiosInstance from '@/lib/axios';
import type {
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
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
 * Retrieves all topics ordered by creation date (newest first).
 * @returns Array of topics with preloaded creator information
 * @throws {AxiosError} On network errors
 */
export const getTopics = async (): Promise<Topic[]> => {
  const response = await axiosInstance.get<Topic[]>('/topics');
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
 * @throws {AxiosError} On network errors or if topic not found (404)
 */
export const deleteTopic = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/topics/${id}`);
};
