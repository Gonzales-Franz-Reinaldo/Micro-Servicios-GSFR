export const handleError = (res, status, message) => {
    res.status(status).render("error", { message });
};