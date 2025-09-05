const successResponse = (data, message = "Operación exitosa") => {
    return {
        success: true,
        message,
        data,
    };
};

const errorResponse = (message, error = null, statusCode = 500) => {
    const response = {
        success: false,
        message,
    };

    if (error && process.env.NODE_ENV === "development") {
        response.error = error;
    }

    return response;
};

const createError = (message, statusCode = 500, error = null) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    err.error = error;
    return err;
};

module.exports = {
    successResponse,
    errorResponse,
    createError,
};