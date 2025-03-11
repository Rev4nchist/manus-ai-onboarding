// lib/utils.ts - Utility functions for consistent styling

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and merges Tailwind classes
 * @param inputs - Class names to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const d = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

/**
 * Format time for display
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatTime(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Get status color class based on status
 * @param status - Status string
 * @returns Tailwind color class
 */
export function getStatusColorClass(status: string): string {
  switch (status.toLowerCase()) {
    case "on track":
    case "completed":
    case "verified":
    case "success":
      return "bg-success text-white";
    case "delayed":
    case "pending":
    case "warning":
      return "bg-warning text-white";
    case "error":
    case "rejected":
      return "bg-error text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

/**
 * Get progress color class based on percentage
 * @param progress - Progress percentage (0-100)
 * @returns Tailwind color class
 */
export function getProgressColorClass(progress: number): string {
  if (progress < 30) return "bg-error";
  if (progress < 70) return "bg-warning";
  return "bg-success";
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Generate initials from name
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return "";
  
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
