import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'http://localhost:8081',
    clientId: 'tilltide-pwa',
    redirectUri: 'http://localhost:4200/auth/callback',
    postLogoutRedirectUri: 'http://localhost:4200/user/login',
    responseType: 'code',
    scope: 'openid profile iam.read iam.write',
    showDebugInformation: true,
    requireHttps: false,           // dev only
    disablePKCE: false,
    // logoutUrl is NOT set → we handle navigation manually (Spring does not expose full OIDC logout)
};
