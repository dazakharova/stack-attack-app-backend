const containersRouter = require('express').Router();
const { query } = require('../db/index.js');

// Create a new container
containersRouter.post('/', async (request, response) => {
    const { name, parent_id, user_id } = request.body;

    try {
        const result = await query('INSERT INTO containers (name, parent_id, user_id) VALUES () $1, $2, $3', [
            name, parent_id, user_id
        ]);
        response.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error })
    }
})

// Return all containers for user
containersRouter.get('/users/:userId', async(request, response) => {
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
containersRouter.put('/:id', async(request, response) => {
    const { id } = request.params;
    const { name } = request.body;

    try {
        const result = await query('UPDATE containers SET name = $1 WHERE id = $2 RETURNING *', [
            name, id
        ]);
        response.status(204).json(result.rows[0])
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error })
    }
})

// Delete a container
containersRouter.delete('/:id', async(request, response) => {
    const { id } = request.params;

    try {
        const result = await query('DELETE FROM containers WHERE id = $1', [id]);
        response.status(204).json({ id: id });
    } catch(error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})