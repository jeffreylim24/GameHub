/**
 * @fileoverview Shared utility helpers for UI composition.
 *
 * @module lib/utils
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges conditional class names with Tailwind-aware conflict resolution.
 *
 * @param inputs - Class name values to merge
 * @returns Combined class name string
 *
 * @example
 * ```ts
 * cn('px-4', isActive && 'bg-blue-500');
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
