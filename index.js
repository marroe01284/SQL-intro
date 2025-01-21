import express, { text } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import 'dotenv/config';
const connection = await  mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const port = process.env.PORT || 3002;

const app = express();


// This is called middleware
app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
    const [result] = await connection.query('SELECT * FROM user');
    res.json(result);
});

app.get('/user/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!isNaN(id)) {
        try {
            const [result] = await connection.query(
                'SELECT * FROM user WHERE id = ?',
                [id]
            );

            if (result.length) {
                res.json(result);
            } else {
                res.send('No user found.');
            }
        } catch (error) {
            res.status(500).send('Something went wrong');
        }
    } else {
        res.status(400).send('ID is not a valid number');
    }
});

// create sort query // http://localhost:3002/test?sort=id&sortOrder=DESC 
app.get('/test', async (req, res) => {
    const sort = req.query.sort || 'id';
    const sortOrder = req.query.sortOrder || 'DESC';
    const query = `SELECT * FROM test ORDER BY ${sort} ${sortOrder}`;
    const [result] = await connection.query(query);
    res.json(result);
});

app.get('/test/:id', async (req, res) => {
    const { id } = req.params;
    const [result] = await connection.query('SELECT * FROM test WHERE id = ' + id);
    res.json(result);
});
app.post('/test', async (req, res) => {
    const { content } = req.body;

    const [result] = await connection.query(`
    INSERT INTO test (content)
    VALUES ('${content}')
    `);
    res.json(result);
})
// http://localhost:3002/test?sort=id&sortOrder=DESC
app.post('/post', async (req, res) => {
    const { id, title, content } = req.body;

    const [result] = await connection.query(`
    INSERT INTO post (title, content, user_id)
    VALUES ('${title}', '${content}', ${id})
    `);
    res.json(result);
})

app.get('/query', (req, res) => {
    res.send(req.query);
});

app.get('/post', async (req, res) => {
    res.send(req.query);
})

app.listen(port, () => {
    console.log('Server started on port 3000');
})

