const express = require("express");
const server = express();
const cors = require("cors");

const PORT = process.env.PORT || 5001;
const stor = [];
const stor2 = [];
server.use(cors());
server.use(express.json());


server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

server.get("/", (req, res) => {
    console.log("successful request made");
    res.status(200).json(stor);
});
server.post("/", (req, res) => {
    data = req.body
    console.log("requested with: ", data);
    stor2.length = 0;
    data["update"].map(x => stor2.unshift(x)) && stor2.map(x => stor.unshift(x));
    console.log("this is storage, now: ", stor);
    res.status(201).json(data);
});
server.post("/reset", (req, res) => {
    stor.length = 0;
    res.status(201).json("successfully reset api");
});