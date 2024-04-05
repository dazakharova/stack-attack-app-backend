const itemsRouter = require('express').Router();
const { query } = require('../db/index.js');
const { authenticateToken } = require('../middleware/authentication');

// Create a new item
itemsRouter.post('/', authenticateToken, async(request, response) => {
    const { name, parent_id, user_id} = request.body;

    try {
        const result = await query('INSERT INTO items (name, container_id, user_id) VALUES ($1, $2, $3) RETURNING *',
        [name, parent_id, user_id]);
        response.status(201).json(result.rows[0]);
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
    const { id } = request.params;
    const { name } = request.body;

    try {
        const result = await query('UPDATE items SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        response.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

// Delete an item
itemsRouter.delete('/:itemId', authenticateToken, async(request, response) => {
    const { id } = request.params;

    try {
        const result = await query('DELETE FROM items WHERE id = $1', [id]);
        response.status(204).json({ id: id });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

module.exports = itemsRouter