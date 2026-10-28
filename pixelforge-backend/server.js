import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import chatRoutes from './src/routes/chat.route.js';
import { llm } from './src/config/ollama.config.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);

    // Load the model into memory now, so the first real question isn't slow
    llm.invoke('Hej')
        .then(() => console.log('Model is loaded and ready'))
        .catch((error) => console.error('Could not load model:', error.message));
});