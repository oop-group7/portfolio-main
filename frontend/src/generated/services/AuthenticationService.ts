/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JwtResponse } from '../models/JwtResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { MessageResponse } from '../models/MessageResponse';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { SignupRequest } from '../models/SignupRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthenticationService {

    /**
     * Register new user
     * Registers a new user with the provided signup credentials. If the user is successfully registered, a verification email is sent to the user. The user must verify their email before they can login. Remember to check that your password meets the required password requirements (between 8-25 characters, has at least a symbol, a numeric character, and an upper and lowercase letter).
     * @returns JwtResponse Successful registration
     * @throws ApiError
     */
    public static registerUser({
        requestBody,
    }: {
        requestBody: SignupRequest,
    }): CancelablePromise<JwtResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/signup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request, check the error message.`,
                500: `Error in Java mail configuration.`,
            },
        });
    }

    /**
     * Sign in to the website
     * Authenticates a user with the provided login credentials and returns a JWT token upon successful authentication.
     * @returns JwtResponse Successful sign in
     * @throws ApiError
     */
    public static authenticateUser({
        requestBody,
    }: {
        requestBody: LoginRequest,
    }): CancelablePromise<JwtResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/signin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Update forgotten password
     * This method is used to save the new password for a user who has forgotten their password. The user is not required to be logged in.
     * @returns MessageResponse Password successfully reset.
     * @throws ApiError
     */
    public static savePassword({
        requestBody,
    }: {
        requestBody: ResetPasswordRequest,
    }): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/saveforgottenpassword',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request, check the error message.`,
            },
        });
    }

    /**
     * Resend registration token
     * Resends a user's registration token. This is useful if the user did not receive the initial registration token.
     * @returns MessageResponse Re-sent registration token.
     * @throws ApiError
     */
    public static resendRegistrationToken({
        token,
    }: {
        token: string,
    }): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/resendregistrationtoken',
            query: {
                'token': token,
            },
            errors: {
                400: `Invalid token.`,
            },
        });
    }

    /**
     * Forgot password
     * This method is used to send a password reset email to the user. The user is not required to be logged in.
     * @returns MessageResponse Send password recovery email.
     * @throws ApiError
     */
    public static forgotPassword({
        email,
    }: {
        email: string,
    }): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/forgotpassword',
            query: {
                'email': email,
            },
        });
    }

}
