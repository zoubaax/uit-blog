const db = require('../config/db');

const findAll = async ({ search = '', category = '', sort = 'newest', page = 1, limit = 10 } = {}) => {
    const values = [];
    const whereClauses = [];

    if (search && search.trim() !== '') {
        values.push(`%${search.trim()}%`);
        whereClauses.push(`(a.title ILIKE $${values.length} OR a.content ILIKE $${values.length} OR u.username ILIKE $${values.length} OR e.title ILIKE $${values.length})`);
    }

    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
        values.push(category.trim());
        whereClauses.push(`a.category ILIKE $${values.length}`);
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    let orderStr = 'ORDER BY a.created_at DESC';
    if (sort === 'oldest') {
        orderStr = 'ORDER BY a.created_at ASC';
    } else if (sort === 'popular') {
        orderStr = 'ORDER BY COALESCE(a.views, 0) DESC, a.created_at DESC';
    } else if (sort === 'title_asc') {
        orderStr = 'ORDER BY a.title ASC';
    } else if (sort === 'title_desc') {
        orderStr = 'ORDER BY a.title DESC';
    }

    let paginationStr = '';
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);

    if (!isNaN(parsedLimit) && parsedLimit > 0) {
        const offset = Math.max(0, ((!isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1) - 1) * parsedLimit);
        values.push(parsedLimit);
        const limitParam = `$${values.length}`;
        values.push(offset);
        const offsetParam = `$${values.length}`;
        paginationStr = `LIMIT ${limitParam} OFFSET ${offsetParam}`;
    }

    const query = `
        SELECT 
            a.*, 
            u.username AS author_name, 
            e.title AS event_title, 
            e.date AS event_date,
            COUNT(*) OVER()::int AS total_count 
        FROM articles a 
        LEFT JOIN users u ON a.author_id = u.id 
        LEFT JOIN events e ON a.event_id = e.id 
        ${whereStr} 
        ${orderStr} 
        ${paginationStr}
    `;

    const result = await db.query(query, values);
    const total = result.rows.length > 0 ? result.rows[0].total_count : 0;
    
    // Clean up total_count from each individual row
    const articles = result.rows.map(row => {
        const { total_count, ...article } = row;
        return article;
    });

    return { articles, total };
};

const slugify = (text = '') => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 200);
};

const generateUniqueSlug = async (title, currentArticleId = null) => {
    let baseSlug = slugify(title) || 'article';
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        let query = 'SELECT id FROM articles WHERE slug = $1';
        let params = [slug];
        if (currentArticleId) {
            query += ' AND id != $2';
            params.push(currentArticleId);
        }
        const res = await db.query(query, params);
        if (res.rows.length === 0) {
            return slug;
        }
        counter++;
        slug = `${baseSlug}-${counter}`;
    }
};

const findById = async (idOrSlug) => {
    const isNumeric = /^\d+$/.test(String(idOrSlug).trim());
    let query;
    let params;

    if (isNumeric) {
        query = `SELECT 
            a.*, 
            u.username AS author_name, 
            e.title AS event_title, 
            e.date AS event_date 
         FROM articles a 
         LEFT JOIN users u ON a.author_id = u.id 
         LEFT JOIN events e ON a.event_id = e.id 
         WHERE a.id = $1 OR a.slug = $2`;
        params = [parseInt(idOrSlug, 10), String(idOrSlug).trim()];
    } else {
        query = `SELECT 
            a.*, 
            u.username AS author_name, 
            e.title AS event_title, 
            e.date AS event_date 
         FROM articles a 
         LEFT JOIN users u ON a.author_id = u.id 
         LEFT JOIN events e ON a.event_id = e.id 
         WHERE a.slug = $1`;
        params = [String(idOrSlug).trim()];
    }

    const result = await db.query(query, params);
    return result.rows[0];
};

const incrementViews = async (idOrSlug) => {
    const isNumeric = /^\d+$/.test(String(idOrSlug).trim());
    let query;
    let params;

    if (isNumeric) {
        query = 'UPDATE articles SET views = COALESCE(views, 0) + 1 WHERE id = $1 OR slug = $2 RETURNING views';
        params = [parseInt(idOrSlug, 10), String(idOrSlug).trim()];
    } else {
        query = 'UPDATE articles SET views = COALESCE(views, 0) + 1 WHERE slug = $1 RETURNING views';
        params = [String(idOrSlug).trim()];
    }

    const result = await db.query(query, params);
    return result.rows[0];
};

const getCategories = async () => {
    const result = await db.query(
        `SELECT COALESCE(category, 'General') as category, COUNT(*)::int as count 
         FROM articles 
         GROUP BY category 
         ORDER BY count DESC, category ASC`
    );
    return result.rows;
};

const getRelated = async (id, category, limit = 3) => {
    let result = await db.query(
        `SELECT a.*, u.username as author_name, e.title as event_title 
         FROM articles a 
         LEFT JOIN users u ON a.author_id = u.id 
         LEFT JOIN events e ON a.event_id = e.id 
         WHERE a.id != $1 AND a.category = $2 
         ORDER BY a.created_at DESC 
         LIMIT $3`,
        [id, category || '', limit]
    );

    if (result.rows.length < limit) {
        const remaining = limit - result.rows.length;
        const existingIds = [id, ...result.rows.map(r => r.id)];
        const backfill = await db.query(
            `SELECT a.*, u.username as author_name, e.title as event_title 
             FROM articles a 
             LEFT JOIN users u ON a.author_id = u.id 
             LEFT JOIN events e ON a.event_id = e.id 
             WHERE a.id != ALL($1::int[]) 
             ORDER BY a.created_at DESC 
             LIMIT $2`,
            [existingIds, remaining]
        );
        return [...result.rows, ...backfill.rows];
    }

    return result.rows;
};

const create = async (title, content, imageUrl, authorId, category = 'General', eventId = null, projectUrl = null) => {
    const parsedEventId = eventId ? parseInt(eventId, 10) : null;
    const slug = await generateUniqueSlug(title);
    const result = await db.query(
        'INSERT INTO articles (title, content, image_url, author_id, category, event_id, project_url, slug) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [title, content, imageUrl, authorId, category || 'General', parsedEventId, projectUrl || null, slug]
    );
    return result.rows[0];
};

const update = async (id, title, content, imageUrl, category, eventId, projectUrl) => {
    const parsedEventId = eventId !== undefined ? (eventId ? parseInt(eventId, 10) : null) : undefined;
    const slug = await generateUniqueSlug(title, id);
    
    // Build query handling optional fields
    const result = await db.query(
        `UPDATE articles 
         SET title = $1, 
             content = $2, 
             image_url = COALESCE($3, image_url), 
             category = COALESCE($4, category),
             event_id = $5,
             project_url = $6,
             slug = $7,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $8 RETURNING *`,
        [title, content, imageUrl, category, parsedEventId ?? null, projectUrl ?? null, slug, id]
    );
    return result.rows[0];
};

const remove = async (id) => {
    const result = await db.query('DELETE FROM articles WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};

module.exports = {
    findAll,
    findById,
    incrementViews,
    getCategories,
    getRelated,
    create,
    update,
    remove,
};
