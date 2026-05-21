export const successResponse = <T>(
    message: string,
    body: T ,
    status = 200
) => ({
    success: true,
    status,
    message,
    body,
});

export const errorResponse = (
    message: string,
    status = 500
) => ({
    success: false,
    status,
    message,
    body: null,
});