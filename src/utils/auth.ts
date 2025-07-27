export interface AuthResponse {
    user?: any;
    session?: any;
    message?: string;
    error?: string;
}

export const authAPI = {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            return { error: 'Network error. Please try again.' };
        }
    },

    async signup(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            return { error: 'Network error. Please try again.' };
        }
    },

    async logout(): Promise<AuthResponse> {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            return { error: 'Network error. Please try again.' };
        }
    },

    async signInWithGoogle(): Promise<AuthResponse> {
        try {
            const response = await fetch('/api/auth/google', {
                method: 'POST',
            });

            const data = await response.json();
            return data;
        } catch (error: any) {
            return { error: error.message };
        }
    },
};
