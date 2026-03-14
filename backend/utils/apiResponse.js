const success = (res, data, status = 200) => res.status(status).json({ success: true, data });
const error = (res, message, status = 400) => res.status(status).json({ success: false, message });
const paginated = (res, data, meta) => res.json({ success: true, data, meta });

module.exports = { success, error, paginated };
