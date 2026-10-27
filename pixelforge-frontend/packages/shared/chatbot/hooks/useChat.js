import { useState, useEffect } from 'react';
import { askChatbot } from '@pixelforge/api';

const STORAGE_KEY = 'pixelforge-chat';

const WELCOME_MESSAGE = {
    role: 'assistant',
    content: 'Hej! 👋 Jag är PixelForges assistent. Fråga mig om produkter, priser, lagerstatus, leverans, retur eller reklamation.'
};

const loadMessages = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [WELCOME_MESSAGE];
    } catch {
        return [WELCOME_MESSAGE];
    }
};

export const useChat = () => {
    const [messages, setMessages] = useState(loadMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const sendMessage = async (question) => {
        if (!question.trim() || isLoading) return;

        // History = everything said before this new question
        const history = [...messages];

        setMessages((prev) => [...prev, { role: 'user', content: question }]);
        setIsLoading(true);
        setError(null);

        try {
            const answer = await askChatbot({ question, history });
            setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([WELCOME_MESSAGE]);
        setError(null);
    };

    return { messages, sendMessage, isLoading, error, clearChat };
};
