
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2, User, Bot } from 'lucide-react';
import { AppData } from '../types';
import { getAiInsight } from '../services/aiService';
import { marked } from 'marked';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppData | null;
}

interface ConversationTurn {
    role: 'user' | 'assistant';
    content: string;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose, appData }) => {
    const [conversation, setConversation] = useState<ConversationTurn[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setConversation([]);
            setUserInput('');
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation, isLoading]);

    const handleSend = async () => {
        if (!userInput.trim() || isLoading) return;

        const newConversation: ConversationTurn[] = [...conversation, { role: 'user', content: userInput }];
        setConversation(newConversation);
        setUserInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getAiInsight(userInput, appData);
            setConversation([...newConversation, { role: 'assistant', content: aiResponse }]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setConversation([...newConversation, { role: 'assistant', content: `Sorry, I encountered an error: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-2xl border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden m-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/20 flex-shrink-0">
                    <div className="flex items-center">
                        <Sparkles className="h-6 w-6 text-yellow-500 dark:text-yellow-300 mr-3" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white/90">AI Assistant</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Conversation */}
                <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-slate-50 dark:bg-transparent">
                    {conversation.length === 0 && (
                        <div className="text-center text-slate-500 dark:text-slate-400 mt-8">
                            <Bot size={48} className="mx-auto" />
                            <p className="mt-4">Ask me anything about your dashboard data!</p>
                             <p className="text-xs mt-2">e.g., "Which branch has the highest sales?" or "Summarize risk metrics."</p>
                        </div>
                    )}
                    {conversation.map((turn, index) => (
                        <div key={index} className={`flex items-start gap-3 ${turn.role === 'user' ? 'justify-end' : ''}`}>
                            {turn.role === 'assistant' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-accent flex items-center justify-center text-white"><Bot size={20} /></div>}
                            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-white ${turn.role === 'user' ? 'bg-blue-600' : 'bg-slate-500 text-slate-900 dark:bg-slate-700 dark:text-white'}`}>
                                <div 
                                    className="prose prose-sm dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: marked.parse(turn.content) as string }} 
                                />
                            </div>
                            {turn.role === 'user' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-white"><User size={20} /></div>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-accent flex items-center justify-center text-white"><Bot size={20} /></div>
                            <div className="bg-slate-200 dark:bg-slate-700 rounded-xl px-4 py-3 flex items-center space-x-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-200 dark:border-white/20 flex-shrink-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about your data..."
                            disabled={isLoading}
                            className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-white/30 rounded-lg py-2 pl-4 pr-12 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !userInput.trim()}
                            className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAssistantModal;