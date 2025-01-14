import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const connection = await  mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    database: 'sql7757078',
    user: 'sql7757078',
    password: 'TUHblDz1zP',
    port: '3306'
});

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

app.listen(3000, () => {
    console.log('Server started on port 3000');
})

