import Express from "express";
import cors from "cors";
import routes from "./routes";
import "dotenv/config";

const server = Express();

const PORT = process.env.PORT || 3000;

server.use(cors());
server.use(routes);
server.listen(PORT);
console.log(`Server started at ${PORT}`);
