import express from "express";
import bodyParser from "body-parser";
import router from "./routes/messageRoutes.js";

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(router);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express.js, and Postgres API' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})