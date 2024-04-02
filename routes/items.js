const itemsRouter = require('express').Router();
const { query } = require('../db/index.js');

// Create a new item
itemsRouter.post('/', async(request, response) => {
    const { name, parent_id, user_id} = request.body;

    try {
        const result = await('INSERT INTO items (name, parent_id, user_id) VALUES ($1, $2, $3) RETURNING *',
        [name, parent_id, user_id]);
        response.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error });
    }
})

// Return all items for the user
itemsRouter.get('/users/:userId', async(request, response) => {
    const { userID } = request.params;

    try {
        const result = await query('SELECT * FROM items WHERE id = $1', [userId]);
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

// Update an item
itemsRouter.put('/:itemId', async(request, response) => {
    const { id } = request.params;
    const { name } = request.body;

    try {
        const result = await query('UPDATE items SET name = $1 RETURNING *', [id]);
        response.status(204).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

// Delete an item
itemsRouter.delete('/:itemId', async(request, response) => {
    const { id } = request.params;

    try {
        const result = await query('DELETE FROM items WHERE id = $1', [id]);
        response.status(204).json({ id: id });
    } catch (error) {
        console.error(error);
        resposne.status(500).json({ error: error });
    }
})

module.exports = itemsRouter