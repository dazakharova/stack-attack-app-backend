const itemsRouter = require('express').Router();
const { query } = require('../db/index.js');
const { authenticateToken } = require('../middleware/authentication');

// Create a new item
itemsRouter.post('/', authenticateToken, async(request, response) => {
    const { name, description, container_id, image } = request.body;

    try {
        const result = await query('INSERT INTO items (name, description, container_id, user_id, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, container_id, request.userID, image]);
        response.status(201).json(result.rows);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error });
    }
})

// Return all items for the user
itemsRouter.get('/', authenticateToken, async(request, response) => {
    try {
        const result = await query('SELECT * FROM items WHERE user_id = $1', [request.userID]);
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

// Update an item
itemsRouter.put('/:itemId', authenticateToken, async(request, response) => {
    const { itemId } = request.params;
    const { name, description } = request.body;

    try {
        if (name) {
            const result = await query('UPDATE items SET name = $1 WHERE id = $2 RETURNING *', [name, itemId]);
            response.status(200).json(result.rows[0]);
        } else if (description) {
            const result = await query('UPDATE items SET description = $1 WHERE id = $2 RETURNING *', [description, itemId]);
            response.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

// Delete an item
itemsRouter.delete('/:itemId', authenticateToken, async(request, response) => {
    const { itemId } = request.params;

    try {
        const result = await query('DELETE FROM items WHERE id = $1 RETURNING *', [itemId]);
        response.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

module.exports = itemsRouter