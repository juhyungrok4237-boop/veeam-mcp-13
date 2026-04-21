/**
 * Veeam REST API Axios Client
 * Handles OAuth2 authentication with automatic token refresh via interceptors.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export class VeeamClient {
  private readonly client: AxiosInstance;
  private readonly baseAuthUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private isAuthenticating: boolean = false;
  private authPromise: Promise<void> | null = null;

  constructor() {
    const host = (process.env.VEEAM_SERVER ?? "https://localhost").replace(/\/$/, "");
    const port = process.env.VEEAM_PORT ?? "9419";
    const baseURL = `${host}:${port}`;

    this.baseAuthUrl = baseURL;

    this.client = axios.create({
      baseURL: `${baseURL}/api/v1`,
      headers: {
        "x-api-version": "1.3-rev1",
        "Content-Type": "application/json",
      },
      // Allow self-signed certs (controlled by NODE_TLS_REJECT_UNAUTHORIZED)
    });

    // Request interceptor: inject Bearer token
    this.client.interceptors.request.use(async (config) => {
      if (this.needsRefresh()) {
        await this.ensureAuthenticated();
      }
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Response interceptor: retry once on 401
    this.client.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          this.accessToken = null; // Force re-auth
          await this.ensureAuthenticated();
          (originalRequest as any).headers.Authorization = `Bearer ${this.accessToken}`;
          return this.client(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }

  private needsRefresh(): boolean {
    // Refresh if token is null or expiry is within 60 seconds
    return !this.accessToken || Date.now() >= this.tokenExpiry - 60_000;
  }

  // Deduplicate concurrent authentication calls
  async ensureAuthenticated(): Promise<void> {
    if (this.isAuthenticating && this.authPromise) {
      return this.authPromise;
    }
    this.isAuthenticating = true;
    this.authPromise = this._doAuthenticate().finally(() => {
      this.isAuthenticating = false;
      this.authPromise = null;
    });
    return this.authPromise;
  }

  private async _doAuthenticate(): Promise<void> {
    const username = process.env.VEEAM_USERNAME;
    const password = process.env.VEEAM_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "Missing environment variables: VEEAM_USERNAME and/or VEEAM_PASSWORD must be set."
      );
    }

    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);

    const response = await axios.post(`${this.baseAuthUrl}/api/oauth2/token`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-api-version": "1.3-rev1",
      },
    });

    this.accessToken = response.data.access_token as string;
    const expiresIn: number = response.data.expires_in ?? 3600;
    this.tokenExpiry = Date.now() + expiresIn * 1000;
  }

  async logout(): Promise<void> {
    if (!this.accessToken) return;
    try {
      await axios.post(
        `${this.baseAuthUrl}/api/oauth2/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "x-api-version": "1.3-rev1",
          },
        }
      );
    } finally {
      this.accessToken = null;
      this.tokenExpiry = 0;
    }
  }

  // Expose the underlying client for use in tool modules
  get api(): AxiosInstance {
    return this.client;
  }
}

// Singleton instance shared across all tool modules
let _instance: VeeamClient | null = null;

export function getVeeamClient(): VeeamClient {
  if (!_instance) {
    _instance = new VeeamClient();
  }
  return _instance;
}
