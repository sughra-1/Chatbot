import { Router } from 'express';
import { llmRoutingChain, chain } from '../ai/chains.ai.js';
import { invokeAssistant } from '../ai/assistant.ai.js';
import { cleanAnswer } from '../utils/cleanAnswer.js';

const router = Router();

router.post('/', async (req, res) => {
    const { question } = req.body;
    // Only send the latest messages to the model, so long chats stay fast
    const history = (req.body.history ?? []).slice(-6);
    console.log('Received question:', question);

    if (!question?.trim()) {
        return res.status(400).json({ error: 'Question is missing' });
    }

    try {
        const start = Date.now();

        const { route } = await llmRoutingChain.invoke({ history, question });
        console.log(`ROUTE: ${route} (${Date.now() - start} ms)`);

        let answer = '';

        if (route === 'rag') {
            answer = await chain.invoke({ history, question });
        } else {
            answer = await invokeAssistant(question, history);
        }

        answer = cleanAnswer(answer);
        console.log(`ANSWER (total ${Date.now() - start} ms):`, answer);
        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong in the chatbot' });
    }
});

export default router;
