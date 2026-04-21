const db = require('../config/db');

const getSetting = async (key) => {
    const result = await db.query('SELECT value FROM settings WHERE key = $1', [key]);
    return result.rows[0]?.value;
};

const updateSetting = async (key, value) => {
    const result = await db.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2 RETURNING *',
        [key, JSON.stringify(value)]
    );
    return result.rows[0].value;
};

const createApplication = async (data) => {
    const { full_name, email, major, motivation } = data;
    const result = await db.query(
        'INSERT INTO club_applications (full_name, email, major, motivation) VALUES ($1, $2, $3, $4) RETURNING *',
        [full_name, email, major, motivation]
    );
    return result.rows[0];
};

const getAllApplications = async () => {
    const result = await db.query('SELECT * FROM club_applications ORDER BY created_at DESC');
    return result.rows;
};

const deleteApplication = async (id) => {
    const result = await db.query('DELETE FROM club_applications WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};

const clearAllApplications = async () => {
    await db.query('TRUNCATE TABLE club_applications');
    return true;
};

module.exports = {
    getSetting,
    updateSetting,
    createApplication,
    getAllApplications,
    deleteApplication,
    clearAllApplications
};
