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

// Login method that returns failed if no login, 
// and the profile of the corresponding person if they succeed
app.get("/login/:email/:password", async (req, res) => {
    await client.connect();

    const newLogin = {
        "email": req.params.email,
        "password": req.params.password
    };

    //console.log(newLogin);

    const results = await db.collection("login").findOne(newLogin);

    if (!results) {
        const failedLogin = {
            "message": "Login failed"
        };
        res.send(failedLogin).status(404);
    } else {
        const query = { "id": Number(results.id) };
        const profile = await db.collection("profiles")
            .findOne(query);
        res.send(profile).status(200);
    }
});

//POST method for signing up to the website
// adds the new user to both the profile and login pages
app.post("/profile", async (req, res) => {
    try {
        await client.connect();

        // Check if the email already exists in the profiles collection
        const existingProfile = await db.collection("profiles").findOne({ email: req.body.email });
        if (existingProfile) {
            return res.status(200).send({ message: "Email already exists" });
        } else {

            // Find the highest ID currently in the profiles table
            const query = {};
            const profiles = await db
                .collection("profiles")
                .find(query)
                .toArray();

            let maxId = 0;
            profiles.forEach(profile => {
                if (profile.id > maxId) {
                    maxId = profile.id;
                }
            });

            // Generate a new unique ID
            const newId = maxId + 1;

            const newProfile = {
                "id": newId,
                "fullName": req.body.fullName,
                "email": req.body.email,
                "address": req.body.address,
                "profilePicture": req.body.profilePicture
            };
            const newLogin = {
                "email": req.body.email,
                "password": req.body.password,
                "id": newId
            }
            console.log(newProfile);
            console.log(newLogin);

            const ProfileResult = await db
                .collection("profiles")
                .insertOne(newProfile);

            const loginResult = await db
                .collection("login")
                .insertOne(newLogin);


            // Respond with success message
            res.status(200).send({
                message: "User signed up successfully",
                profile: ProfileResult,
                login: loginResult
            });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ message: 'An internal server error occurred' });
    }
});

//Delete Profile function that deleted the profile and login based on the id value in the URL
app.delete("/profile/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        await client.connect();
        console.log("Profile to delete :", id);
        const query = { id: id };
        // delete
        const profileDeleted = await db.collection("profiles").deleteOne(query);

        const loginDeleted = await db.collection("login").deleteOne(query);

        res.status(200).send({
            message: "User Deleted successfully",
            profile: profileDeleted,
            login: loginDeleted
        });
    }
    catch (error) {
        console.error("Error deleting robot:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


//PUT method that update a profile in the profiles database and a login in the login database based on the id
app.put("/profile/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
    await client.connect();
    console.log("profile to Update :", id);
    // Data for updating the document, typically comes from the request body
    console.log(req.body);

    const curLogin = await db.collection('login').findOne(query);
    if (curLogin.password !== req.body.oldPassword) {
        return res.status(200).send({
            message: 'Incorrect Password'
        });

    }

    const updateProfile = {
        $set: {
            "id": id,
            "fullName": req.body.fullName,
            "email": req.body.email,
            "address": req.body.address,
            "profilePicture": req.body.profilePicture
        }
    };
    const updateLogin = {
        $set: {
            "email": req.body.email,
            "password": req.body.password,
            "id": id
        }
    }
    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = {};
    const profileResults = await db.collection("profiles").updateOne(query, updateProfile, options);
    const loginResults = await db.collection("login").updateOne(query, updateLogin, options);

    // If no document was found to update, you can choose to handle it by sending a 404 response
    if (profileResults.matchedCount === 0) {
        return res.status(404).send({ message: 'Profile not found' });
    }
    if (loginResults.matchedCount === 0) {
        return res.status(404).send({ message: 'Login not found' });
    }

    const profileUpdated = await db.collection("profiles").findOne(query);


    res.status(200).send({
        message: "User updated successfully",
        profile: profileResults,
        login: loginResults
    });
});

//Web Socket for communication in the messages screen

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Array to store connected clients
const clients = [];


// Function to establish a database connection and fetch conversations
const getConversations = async (userId) => {
    const client = new MongoClient(url);
    try {
        // Connect to the MongoDB server
        await client.connect();

        // Fetch conversations associated with the user ID
        const conversations = await db.collection('messages').find({ users: { $elemMatch: { id: userId } } }).toArray();
        return conversations;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return [];
    } finally {
        // Close the database connection
        await client.close();
    }
};

// Function to send conversations to a client
const sendConversations = async (ws, userId) => {
    try {
        // Fetch conversations associated with the user ID
        const conversations = await getConversations(userId);

        // Send conversations to the client
        ws.send(JSON.stringify({ type: 'conversations', data: conversations }));
    } catch (error) {
        console.error('Error sending conversations to client:', error);
    }
};

const updateConversation = async (message, convId) => {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const query = { id: convId };

        // Generate a unique ID for the new message
        const messageId = generateUniqueMessageId();

        // Add the unique ID to the message
        const messageWithId = { ...message, id: messageId };

        const updateOperation = {
            $push: {
                messages: messageWithId
            }
        };

        const result = await client.db(dbName).collection("messages").updateOne(query, updateOperation);

        if (result.modifiedCount === 0) {
            console.log("No conversation found with ID:", convId);
        } else {
            console.log("Message added to conversation with ID:", convId);
        }

        return result;
    } catch (error) {
        console.error("Error updating conversation:", error);
        return null; // Return null or handle the error as appropriate
    } finally {
        // Close the database connection
        await client.close();
    }
};


// Function to update the read status of a message in the database
const updateMessageReadStatus = async (messageId, readStatus) => {
    const client = new MongoClient(url);
    try {
        await client.connect();

        // Iterate through conversations
        const conversations = await db.collection("messages").find({}).toArray();
        for (const conversation of conversations) {
            // Find the message with the corresponding ID
            const messageIndex = conversation.messages.findIndex(message => message.id === messageId);
            if (messageIndex !== -1) {
                // Update the read status of the message
                conversation.messages[messageIndex].read = readStatus;
                console.log(conversation.messages[messageIndex]);
                // Update the conversation in the database
                await db.collection("messages").updateOne({ id: conversation.id }, { $set: { messages: conversation.messages } });

                console.log("Message read status updated:", messageId);
                return; // Exit the loop once the message is found and updated
            }
        }

        // If the message ID is not found in any conversation
        console.log("Message not found:", messageId);
    } catch (error) {
        console.error("Error updating message read status:", error);
    } finally {
        await client.close();
    }
};


// WebSocket server event listeners
wss.on('connection', (ws, req) => {

    const url = new URL(req.url, 'http://localhost:8080');
    const userId = parseInt(url.searchParams.get('userId'));

    // Add the userId to the WebSocket connection
    ws.userId = userId;
    console.log('Client connected ID: ' + userId);


    // Add the new client to the clients array
    clients.push(ws);

    sendConversations(ws, userId);



    // WebSocket message event listener
    ws.on('message', async (message) => {
        console.log('Received message:');
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);

        if (parsedMessage.type === 'view') {
            updateMessageReadStatus(parsedMessage.message.id, parsedMessage.message.read);
        } else if (parsedMessage.type === 'message') {

            updateConversation(parsedMessage.message, parsedMessage.conversationId);

            const conversation = await db.collection('messages').findOne({ id: parsedMessage.conversationId });
            if (!conversation) {
                console.log('Conversation not found');
                return;
            }

            const recipient = conversation.users.find(user => user.name !== parsedMessage.message.sender);
            if (!recipient) {
                console.log('Recipient not found');
                return;
            }

            const recipientWs = clients.find(client => client.userId === recipient.id);
            if (!recipientWs) {
                console.log('Recipient WebSocket not connected');
                return;
            }

            recipientWs.send(JSON.stringify({ type: 'message', data: parsedMessage.message }));
        }

        // Broadcast the received message to all clients
        // wss.clients.forEach((client) => {
        //     if (client !== ws && client.readyState === WebSocket.OPEN) {
        //         client.send(JSON.stringify({ type: 'message', data: message}));
        //     }
        // });
    });

    // WebSocket close event listener
    ws.on('close', () => {
        console.log('Client disconnected');

        // Remove the disconnected client from the clients array
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});



app.get("/listPosts", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
        .collection("Posts")
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
});

app.post("/addPost", async (req, res) => {
    try {
        await client.connect();
        const keys = Object.keys(req.body);

        const newPost = {
            "title": req.body.title, // also "name": req.body.name,
            "price": req.body.price, // also "price": req.body.price,
            "description": req.body.description, // also "description": req.body.description,
            "category": req.body.category,
            "condition": req.body.condition,
            "imageUrl": req.body.imageUrl
        };
        console.log(newPost);

        const results = await db
            .collection("Posts")
            .insertOne(newPost);
        res.status(200).send(results);

    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
});

const generateUniqueMessageId = () => {
    // Generate a unique ID using a timestamp and a random number
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};