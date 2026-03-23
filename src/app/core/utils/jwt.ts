export interface JwtPayload {
    [key: string]: unknown;
}

export const parseJwtPayload = (token: string | null): JwtPayload | null => {
    if (!token) {
        return null;
    }

    const parts = token.split('.');
    if (parts.length < 2) {
        return null;
    }

    try {
        const payload = parts[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const decoded = atob(payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '='));
        return JSON.parse(decoded) as JwtPayload;
    } catch {
        return null;
    }
};
