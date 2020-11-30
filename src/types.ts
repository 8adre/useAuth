import {
    Auth0UserProfile,
    Auth0DecodedHash,
    Auth0Error,
    Auth0ParseHashError,
    AuthOptions as Auth0Options
} from "auth0-js";
import * as NetlifyIdentityWidget from "netlify-identity-widget";
import { ReactNode } from "react";
import { AnyEventObject, PayloadSender } from "xstate";

export type AuthOptions = {
    dispatch: (eventName: string, eventData?: any) => void;
} & (Auth0Options | NetlifyIdentityWidget.InitOptions);

// TODO: types are leaking Auth0
export type AuthState = {
    user:
        | (Auth0UserProfile & { [key: string]: any }) // adds metadata support for Auth0 Rules
        | { sub?: string; [key: string]: any };
    authResult?: Auth0DecodedHash | null;
    expiresAt: Date | null;
    isAuthenticating: boolean;
    errorType?: string;
    error?: Error | Auth0Error | Auth0ParseHashError;
    config: {
        navigate: Function;
        customPropertyNamespace: string;
        authProvider?: AuthProviderClass;
        callbackDomain: string;
    };
};

// TODO: types are leaking Auth0
export interface useAuthInterface {
    (): {
        isAuthenticating: boolean;
        isAuthenticated: () => boolean;
        isAuthorized: (role: string | string[]) => boolean;
        user: Auth0UserProfile | { sub?: string };
        userId: string | null | undefined;
        authResult: Auth0DecodedHash | undefined | null;
        login: () => void;
        signup: () => void;
        logout: () => void;
        handleAuthentication: ({
            postLoginRoute
        }: {
            postLoginRoute?: string;
        }) => void;
        dispatch: (eventName: string, eventData?: any) => void;
    };
}

export type AuthProviderInterface = (props: {
    children: ReactNode;
    navigate: (path: string) => void;
    auth0_domain: string;
    auth0_audience_domain?: string;
    auth0_client_id: string;
    auth0_params?: Auth0Options;
    customPropertyNamespace?: string;
}) => JSX.Element;

// The shape of auth provider wrappers
export interface AuthProviderClass {
    authorize(): void;
    signup(): void;
    logout(returnTo?: string): void;
    handleLoginCallback(
        dispatch: PayloadSender<AnyEventObject>
    ): Promise<boolean>;
    checkSession(): Promise<{
        user: Auth0UserProfile;
        authResult: Auth0DecodedHash;
    }>;
}
