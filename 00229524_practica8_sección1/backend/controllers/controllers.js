import { pool } from "../data/connection.js";
import bcrypt from "bcrypt";

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email, password } = request.body
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      response.status(500).send("Error al registrar usuario.");
      return;
    }

    pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, hash], (error, results) => {
      if (error) {
        console.error("Error creating user in DB:", error);
        response.status(500).send("Error al registrar usuario.");
        return;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    }
    );
  });
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email, password } = request.body;

  if (password) {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        response.status(500).send("Error al actualizar usuario.");
        return;
      }

      pool.query(
        'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4',
        [name, email, hash, id],
        (error, results) => {
          if (error) {
            console.error("Error updating user with password:", error);
            response.status(500).send("Error al actualizar usuario.");
            return;
          }
          response.status(200).send(`User modified with ID: ${id}`);
        }
      );
    });

  } else {
    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          console.error("Error updating user without password:", error);
          response.status(500).send("Error al actualizar usuario.");
          return;
        }
        response.status(200).send(`User modified with ID: ${id}`);
      }
    );
  }
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};