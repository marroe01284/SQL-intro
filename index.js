import express from 'express';
import cors from 'cors';
const app = express();

let count = 0;

// This is called middleware
app.use(cors());
app.use((req,res,next) => {
    count++;
    console.log(count);
    // The next function makes it go on to the next function
    next();
})

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
})