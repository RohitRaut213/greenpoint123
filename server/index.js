const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const actionRoutes = require('./routes/actionRoutes');

dotenv.config();
const app = express();

// ✅ Allow frontend running at port 5173 (Vite default)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// ✅ Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Route mounting
app.use('/api/users', userRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/actions', actionRoutes);

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3000, () =>
        console.log(`Server running on port ${process.env.PORT || 3000}`)
    );
}).catch((err) => {
    console.error('MongoDB connection failed:', err.message);
});
