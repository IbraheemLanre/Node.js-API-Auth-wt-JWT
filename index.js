const express = require('express'); 
const app = express();
const authRoute = require('./routes/auth'); //import routes
const postRoute = require('./routes/post'); //import routes
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();
// Middleware
app.use(express.json());

// Route middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


// Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
                { useNewUrlParser: true,
                useUnifiedTopology: true },
                () => {
                    console.log('Database Connected');
});

app.listen(3000, () => {
    console.log('app is listening to server and server is running');
});