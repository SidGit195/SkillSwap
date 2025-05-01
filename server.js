require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db')
const app = express();

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const skillRoute = require('./routes/skillRoute');
const sessionRoute = require('./routes/sessionRoute');
const messageRoute = require('./routes/messageRoute');

connectDB();

//middlewares
app.use(express.json());

app.get("/", (_, res) => {
    res.status(200).json({msg: "Hello world"});
})

// routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/skills', skillRoute);
app.use('/api/sessions', sessionRoute);
app.use('/api/messages', messageRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started at ${PORT}`));