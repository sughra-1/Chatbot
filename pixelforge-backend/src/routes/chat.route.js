import { Router } from 'express';
import { llmRoutingChain, chain } from '../ai/chains.ai.js';
import { invokeAssistant } from '../ai/assistant.ai.js';

const router = Router();

router.post('/', async (req, res) => {
    const { question, history = [] } = req.body;
    console.log('Received question:', question);

    if (!question?.trim()) {
        return res.status(400).json({ error: 'Question is missing' });
    }

    try {
        const { route } = await llmRoutingChain.invoke({ history, question });
        console.log('ROUTE:', route);

        let answer = '';

        if (route === 'rag') {
            answer = await chain.invoke({ history, question });
        } else {
            answer = await invokeAssistant(question, history);
        }

        console.log('ANSWER:', answer);
        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong in the chatbot' });
    }
});

export default router;
