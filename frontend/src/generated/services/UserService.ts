/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageResponse } from '../models/MessageResponse';
import type { UpdatePasswordRequest } from '../models/UpdatePasswordRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Update user password
     * Updates a user's password. If you are looking for the endpoint to update the password after a password reset request is sent, check the authentication controller docs.
     * @returns MessageResponse Successfully changed password.
     * @throws ApiError
     */
    public static updatePassword({
        requestBody,
    }: {
        requestBody: UpdatePasswordRequest,
    }): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/updatepassword',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid old password.`,
            },
        });
    }

}
