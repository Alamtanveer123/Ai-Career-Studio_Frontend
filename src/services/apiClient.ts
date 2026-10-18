/**
 * Universal API Client for Full-Stack Integration
 * 
 * Supports connecting to any backend (FastAPI, Express/Node.js, Django, NestJS)
 * Configure your backend URL in .env with VITE_API_URL=http://localhost:5000
 * Gracefully falls back to mock/local state if backend is offline or during development.
 */

const BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || '';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  isFallback?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * GET Request with automatic local fallback
   */
  async get<T>(endpoint: string, fallbackData?: T): Promise<T> {
    if (!this.baseUrl) {
      if (fallbackData !== undefined) return fallbackData;
    }

    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      if (fallbackData !== undefined) {
        // Silently use fallback during dev
        return fallbackData;
      }
      throw err;
    }
  }

  /**
   * POST Request with automatic local fallback
   */
  async post<T, B = any>(endpoint: string, body: B, fallbackData?: T): Promise<T> {
    if (!this.baseUrl) {
      if (fallbackData !== undefined) return fallbackData;
    }

    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw err;
    }
  }

  /**
   * PUT Request with automatic local fallback
   */
  async put<T, B = any>(endpoint: string, body: B, fallbackData?: T): Promise<T> {
    if (!this.baseUrl) {
      if (fallbackData !== undefined) return fallbackData;
    }

    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw err;
    }
  }

  /**
   * DELETE Request with automatic local fallback
   */
  async delete<T>(endpoint: string, fallbackData?: T): Promise<T> {
    if (!this.baseUrl) {
      if (fallbackData !== undefined) return fallbackData;
    }

    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw err;
    }
  }

  /**
   * Check if backend is live
   */
  async checkHealth(): Promise<boolean> {
    if (!this.baseUrl) return false;
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

export const apiClient = new ApiClient();
