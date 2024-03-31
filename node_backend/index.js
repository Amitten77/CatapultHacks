require('dotenv').config({path: './.env'})



const express = require('express')
const cors = require('cors');
const { connectToDb, getDb } = require('./db')
// const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
//init app and middleware
const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 3001


let db
connectToDb((err) => {
    if (!err) {
        app.listen(PORT, () => {
            console.log(`app listening on port ${PORT}`)
        })
        db = getDb()
    } else {
        console.log("ERROR")
    }
})


app.post('/user/authenticate', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const collection = db.collection('Users');
        const user = await collection.findOne({ username: username });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const passwordIsValid = await bcrypt.compare(password, user.hashedPassword);
        if (passwordIsValid) {
            res.status(200).send('User authenticated successfully');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Error authenticating user:', err);
        res.status(500).send('Error during authentication process');
    }
});

app.post('/user', async (req, res) => {
    const userData = req.body;
    try {
        const collection = db.collection('Users');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const insertResult = await collection.insertOne({
            username: req.body.username,
            hashedPassword: hashedPassword
        });
        res.status(201).json(insertResult);
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Error inserting user into database');
    }
})

app.get('/fridge', async (req, res) => {
    try {
        const collection = db.collection('Fridge');
        const documents = await collection.find({}).toArray(); // Fetch all documents
        res.status(200).json(documents);
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).send('Error fetching documents from database');
    }
});

app.post('/fridge/item', async (req, res) => {
    try {
        const collection = db.collection('Fridge');
        const newItem = {
            itemName: req.body.itemName,
            expiration: new Date(req.body.expiration),
            date_added: new Date(req.body.date_added),
            status: req.body.status,
            time_removed: new Date(req.body.time_removed),
            category: req.body.category
        };
        console.log(newItem);

        const insertResult = await collection.insertOne(newItem);
        res.status(201).json({message: "Success"});
    } catch (err) {
        console.error('Error inserting item into fridge:', err);
        res.status(500).send('Error inserting item into database');
    }
});

app.put('/fridge/item', async (req, res) => {
    const { itemName, updateFields } = req.body;

    if (!itemName) {
        return res.status(400).send('Item name is required for updating');
    }

    try {
        const collection = db.collection('Fridge');
        const query = { itemName: itemName };

        const update = {
            $set: updateFields
        };

        const updateResult = await collection.updateOne(query, update);

        if (updateResult.matchedCount === 0) {
            return res.status(404).send('Item not found');
        } else if (updateResult.modifiedCount === 0) {
            return res.status(200).send('No changes made to the item');
        } else {
            return res.status(200).send('Item updated successfully');
        }
    } catch (err) {
        console.error('Error updating item in fridge:', err);
        res.status(500).send('Error updating item in database');
    }
});