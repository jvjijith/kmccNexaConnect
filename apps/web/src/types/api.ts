export interface AuthResponse {
    id: string;
    email?: string;
    accessToken: string;
    refreshToken: string;
  }
  
  export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
      userId: string;
      email: string;
    };
    error?: string;
  }
  
  export interface LoginResponse {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }
  
  export interface RegisterRequest {
    emailId: string;
    name: string;
    phone: string;
    customerUserId: string;
    storeUser: boolean;
    individual: boolean;
    language: string;
  }