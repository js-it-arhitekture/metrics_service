const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8086;

// Connect to MongoDB

//mongodb://mongodb_metrics:27018/metrics_db

const mongodb_conn = process.env.MONGODB_URL || 'mongodb://localhost:27026/metrics_db';
console.log("mongodb_conn", mongodb_conn)

mongoose.connect(mongodb_conn, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define schema and model
const requestDataSchema = new mongoose.Schema({
    data: Object
});

const RequestData = mongoose.model('RequestData', requestDataSchema);

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to push data to the database
app.post('/api/push', async (req, res) => {
    try {
        const requestData = new RequestData({ data: req.body.message });
        console.log("received", req.body.message)
        await requestData.save();
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to pull all data from the database and clean the collection
app.get('/api/pull', async (req, res) => {
    try {
        const allData = await RequestData.find();
        await RequestData.deleteMany({});
        res.json(allData);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
