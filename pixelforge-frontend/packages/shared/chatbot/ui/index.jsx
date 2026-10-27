import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Trash2 } from 'lucide-react';
import { useChat } from '../hooks/useChat.js';
import { ChatMessage } from '../children/chatmessage/index.jsx';
import { TypingIndicator } from '../children/typingindicator/index.jsx';
import './index.css';

const SUGGESTIONS = [
    'Vilka tangentbord har ni?',
    'Hur lång är leveranstiden?',
    'Hur returnerar jag en vara?'
];

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const { messages, sendMessage, isLoading, error, clearChat } = useChat();

    const messagesRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to the newest message
    useEffect(() => {
        messagesRef.current?.scrollTo({
            top: messagesRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [messages, isLoading, isOpen]);

    // Focus the text field when the chat opens
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <>
            {isOpen && (
                <section className="chatbot" aria-label="PixelForge chatt">
                    <header className="chatbot__header">
                        <div className="chatbot__avatar">
                            <Bot size={20} />
                        </div>
                        <div className="chatbot__title">
                            <h2>PixelForge Assistent</h2>
                            <span className="chatbot__status">Online</span>
                        </div>
                        <button
                            type="button"
                            className="chatbot__icon-button"
                            onClick={clearChat}
                            aria-label="Rensa konversationen"
                            title="Rensa konversationen"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button
                            type="button"
                            className="chatbot__icon-button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Stäng chatten"
                            title="Stäng"
                        >
                            <X size={18} />
                        </button>
                    </header>

                    <div className="chatbot__messages" ref={messagesRef}>
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={index}
                                role={message.role}
                                content={message.content}
                            />
                        ))}

                        {messages.length === 1 && !isLoading && (
                            <div className="chatbot__suggestions">
                                {SUGGESTIONS.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => sendMessage(suggestion)}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isLoading && <TypingIndicator />}
                        {error && <p className="chatbot__error">{error}</p>}
                    </div>

                    <form className="chatbot__form" onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            className="chatbot__input"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Skriv ett meddelande..."
                        />
                        <button
                            type="submit"
                            className="chatbot__send"
                            disabled={isLoading || !input.trim()}
                            aria-label="Skicka"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                className="chatbot-toggle"
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? 'Stäng chatten' : 'Öppna chatten'}
            >
                {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
            </button>
        </>
    );
};
