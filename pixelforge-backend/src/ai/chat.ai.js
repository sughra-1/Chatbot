import { routingChain, ragChain } from './chains.ai.js';

const answer = route === 'rag'
    ? await ragChain.invoke({ question, history: chatHistory })
    : await invokeAssistant(question, chatHistory);
