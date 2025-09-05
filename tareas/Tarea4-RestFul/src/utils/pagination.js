const getPaginationParams = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 100); // Máximo 100
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

const createPaginationResponse = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

module.exports = {
    getPaginationParams,
    createPaginationResponse,
};
