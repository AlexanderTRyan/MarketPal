var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";
app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

const { MongoClient } = require("mongodb");

// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "MarketPal";
const client = new MongoClient(url);
const db = client.db(dbName);


app.get("/profile/:id", async (req, res) => {
    const profileid = Number(req.params.id);
    console.log("profile to find :", profileid);

    await client.connect();

    console.log("Node connected successfully to GET-id MongoDB");

    const query = { "id": profileid };
    const results = await db.collection("profiles")
        .findOne(query);

    console.log("Results :", results);

    if (!results) res.send("Not Found").status(404);
    else res.send(results).status(200);
});


// Old examples for how to get and post
// app.get("/listRobots", async (req, res) => {
//     await client.connect();
//     console.log("Node connected successfully to GET MongoDB");
//     const query = {};
//     const results = await db
//         .collection("robot")
//         .find(query)
//         .limit(100)
//         .toArray();
//     console.log(results);
//     res.status(200);
//     res.send(results);
// });

// app.get("/:id", async (req, res) => {
//     const robotid = Number(req.params.id);
//     console.log("Robot to find :", robotid);
//     await client.connect();
//     console.log("Node connected successfully to GET-id MongoDB");
//     const query = { "id": robotid };
//     const results = await db.collection("robot")
//         .findOne(query);
//     console.log("Results :", results);
//     if (!results) res.send("Not Found").status(404);
//     else res.send(results).status(200);
// });

// app.post("/addRobot", async (req, res) => {
//     try {
//         await client.connect();
//         const keys = Object.keys(req.body);
//         const values = Object.values(req.body);

//         const newDocument = {
//             "id": values[0], // also "id": req.body.id,
//             "name": values[1], // also "name": req.body.name,
//             "price": values[2], // also "price": req.body.price,
//             "description": values[3], // also "description": req.body.description,
//             "imageUrl": values[4] // also "imageUrl": req.body.imageUrl
//         };
//         console.log(newDocument);

//         const results = await db
//             .collection("robot")
//             .insertOne(newDocument);
//         res.status(200);
//         res.send(results);

//         res.status(200);
//         res.send(results);
//     } catch (error) {
//         console.error("An error occurred:", error);
//         res.status(500).send({ error: 'An internal server error occurred' });
//     }
// });