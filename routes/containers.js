const containersRouter = require('express').Router();
const { query } = require('../db/index.js');
const { authenticateToken } = require('../middleware/authentication');

// Create a new container
containersRouter.post('/', authenticateToken, async (request, response) => {
    const { name, parent_id, user_id } = request.body;

    try {
        let result;
        if (parent_id) { // If parent_id is provided, use it in the query
            result = await query(
                'INSERT INTO containers (name, parent_id, user_id) VALUES ($1, $2, $3) RETURNING *',
                [name, parent_id, user_id]
            );
        } else { // If parent_id is not provided, exclude it from the query
            result = await query(
                'INSERT INTO containers (name, user_id) VALUES ($1, $2) RETURNING *',
                [name, user_id]
            );
        }
        response.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error })
    }
})

// Return all containers for user
containersRouter.get('/users/:userId', authenticateToken, async(request, response) => {
    const { userId } = request.params;

    try {
        const result = await query('SELECT * FROM containers WHERE user_id = $1', [userId]);
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

// Update a container
containersRouter.put('/:id', authenticateToken, async(request, response) => {
    const { id } = request.params;
    const { name } = request.body;

    try {
        const result = await query('UPDATE containers SET name = $1 WHERE id = $2 RETURNING *', [
            name, id
        ]);
        response.status(200).json(result.rows[0])
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error })
    }
})

// Delete a container
containersRouter.delete('/:id', authenticateToken, async(request, response) => {
    const { id } = request.params;

    try {
        const result = await query('DELETE FROM containers WHERE id = $1', [id]);
        response.status(204).json({ id: id });
    } catch(error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

module.exports = containersRouter