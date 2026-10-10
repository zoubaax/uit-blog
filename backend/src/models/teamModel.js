const db = require('../config/db');

const findAll = async () => {
    // Order by Executive Hierarchy: President -> Vice-President -> General Secretary -> Others
    const query = `
        SELECT * FROM team_members 
        ORDER BY 
            CASE 
                WHEN (role ILIKE '%president%' OR role ILIKE '%président%') AND role NOT ILIKE '%vice%' AND role NOT ILIKE '%assistant%' THEN 1
                WHEN role ILIKE '%vice%' OR role ILIKE '%vp%' THEN 2
                WHEN role ILIKE '%secretary%' OR role ILIKE '%secrétaire%' OR role ILIKE '%secretaire%' OR role ILIKE '%sg%' THEN 3
                WHEN role ILIKE '%treasurer%' OR role ILIKE '%trésorier%' OR role ILIKE '%tresorier%' OR role ILIKE '%trésorière%' THEN 4
                WHEN role ILIKE '%lead%' OR role ILIKE '%head%' OR role ILIKE '%responsable%' OR role ILIKE '%community%' THEN 5
                ELSE 6
            END ASC,
            id ASC
    `;
    const result = await db.query(query);
    return result.rows;
};

const findById = async (id) => {
    const result = await db.query('SELECT * FROM team_members WHERE id = $1', [id]);
    return result.rows[0];
};

const create = async (name, role, photoUrl, socialLinks) => {
    const result = await db.query(
        'INSERT INTO team_members (name, role, photo_url, social_links) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, role, photoUrl, socialLinks]
    );
    return result.rows[0];
};

const update = async (id, name, role, photoUrl, socialLinks) => {
    const result = await db.query(
        `UPDATE team_members
         SET name = $1, role = $2, photo_url = COALESCE($3, photo_url), social_links = COALESCE($4, social_links)
         WHERE id = $5 RETURNING *`,
        [name, role, photoUrl, socialLinks, id]
    );
    return result.rows[0];
};

const remove = async (id) => {
    const result = await db.query('DELETE FROM team_members WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
};
