const containersRouter = require("express").Router();
const { query } = require("../db/index.js");
const { authenticateToken } = require("../middleware/authentication");

// Create a new container
containersRouter.post("/", authenticateToken, async (request, response) => {
  const { name, parent_id } = request.body;

  try {
    let result;
    if (parent_id) {
      // If parent_id is provided, use it in the query
      result = await query(
        "INSERT INTO containers (name, parent_id, user_id) VALUES ($1, $2, $3) RETURNING *",
        [name, parent_id, request.userID]
      );
    } else {
      // If parent_id is not provided, exclude it from the query
      result = await query(
        "INSERT INTO containers (name, user_id) VALUES ($1, $2) RETURNING *",
        [name, request.userID]
      );
    }

    // Respond with all container records for the user
    response.status(201).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Return all containers for user
containersRouter.get("/", authenticateToken, async (request, response) => {
  try {
    const result = await query("SELECT * FROM containers WHERE user_id = $1", [
      request.userID,
    ]);
    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Update a container
containersRouter.put("/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const { name, box_color } = request.body;

  try {
    if (name) {
      const result = await query(
        "UPDATE items SET name = $1 WHERE id = $2 RETURNING *",
        [name, id]
      );
      response.status(200).json(result.rows[0]);
    } else if (box_color) {
      const result = await query(
        "UPDATE items SET description = $1 WHERE id = $2 RETURNING *",
        [box_color, id]
      );
      response.status(200).json(result.rows[0]);
    } else {
      response
        .status(400)
        .json({ error: "Neither name nor boxcolor provided for update." });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error });
  }
});

// Delete a container
containersRouter.delete(
  "/:id",
  authenticateToken,
  async (request, response) => {
    const { id } = request.params;

    try {
      const result = await query(
        "DELETE FROM containers WHERE id = $1 RETURNING *",
        [id]
      );
      response.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: error });
    }
  }
);

module.exports = containersRouter;
