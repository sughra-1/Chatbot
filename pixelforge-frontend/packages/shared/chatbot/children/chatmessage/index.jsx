import ReactMarkdown from 'react-markdown';
import { Bot } from 'lucide-react';

export const ChatMessage = ({ role, content }) => {
    const isUser = role === 'user';

    return (
        <article className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--bot'}`}>
            {!isUser && (
                <div className="chat-message__avatar">
                    <Bot size={16} />
                </div>
            )}
            <div className="chat-message__bubble">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </article>
    );
};
