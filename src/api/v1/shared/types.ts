export interface Session {
    access_token: string | null;
    access_expires_in: number | null;
    refresh_token?: string;
    user: UserData;
}

export interface UserData {
    email: string;
    username: string;
    // avatar_url?: string;
}
