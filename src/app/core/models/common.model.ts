/**
 * Common Models and Types
 * Centralized type definitions to replace 'any' types
 */

export interface SelectOption {
  label: string;
  value: number | string;
}

export interface Stack {
  id: number;
  name: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  stackId: number;
  isActive?: boolean;
}

export interface Position {
  id: number;
  name: string;
  description?: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface EmployeeSkill {
  id: number;
  skillName: string;
  lastUsed?: string;
  selfRating?: number;
  yearsOfExperience?: number;
  notes?: string;
}

export interface TeamEmployee {
  teamName: string;
  teamId?: number;
}

export interface EmployeeProduct {
  productName: string;
  productId?: number;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  employeeNumber?: number;
  positionId?: number;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

