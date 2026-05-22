export type SuccessResponseType<T = unknown> = {
    success: boolean;
    status: number;
    message: string;
    body: T;
};

export type ErrorResponseType = {
    success: boolean;
    status: number;
    message: string;
    body: null;
};