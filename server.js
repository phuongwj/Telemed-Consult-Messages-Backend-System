import express from "express";

const app = express();
const port = 8000;

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express.js, and Postgres API' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})