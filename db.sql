DROP DATABASE IF EXISTS stack_attack;

CREATE DATABASE stack_attack;

\c stack_attack;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL
);

CREATE TABLE containers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER,
    user_id INTEGER NOT NULL,
    box_color VARCHAR(50),
    FOREIGN KEY (parent_id) REFERENCES containers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE items (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   description TEXT,
   container_id INTEGER NOT NULL,
   user_id INTEGER NULL,
   image TEXT,
   FOREIGN KEY (container_id) REFERENCES containers(id) ON DELETE CASCADE,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Inserting initial values for testing

INSERT INTO users (email, password) VALUES
('user1@example.com', 'hashed_password1'),
('user2@example.com', 'hashed_password2');

INSERT INTO containers (name, parent_id, user_id) VALUES
('Container 1', NULL, 1),
('Container 2', NULL, 2),
('Subcontainer 1', 1, 1);

INSERT INTO items (name, description, container_id, user_id) VALUES
('Item 1', 'Description of item 1', 1, 1),
('Item 2', 'Description of item 2', 2, 2),
('Subitem 1', 'Description of subitem 1', 1, 1);




