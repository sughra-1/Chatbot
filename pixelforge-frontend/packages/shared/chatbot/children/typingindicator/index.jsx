import { Bot } from 'lucide-react';

export const TypingIndicator = () => (
    <article className="chat-message chat-message--bot">
        <div className="chat-message__avatar">
            <Bot size={16} />
        </div>
        <div className="chat-message__bubble typing">
            <span className="typing__dot"></span>
            <span className="typing__dot"></span>
            <span className="typing__dot"></span>
        </div>
    </article>
);
