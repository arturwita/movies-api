export interface ApiError {
    response: {
        statusCode: number;
        body: {
            message: string;
            errorCode: string;
        };
    };
}
