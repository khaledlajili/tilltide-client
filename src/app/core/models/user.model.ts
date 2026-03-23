export interface LoginResponse {
    accessToken: string;
    tokenType: string; // "Bearer"
    storeId: string;   // UUID from backend
}

export interface UserCredentials {
    email: string;
    password: string;
}
