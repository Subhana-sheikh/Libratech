import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, BookOpen, User, HelpCircle, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const AssistantChatDrawer = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user ? user.name.split(' ')[0] : 'there'}! I am the Libratech AI Library Assistant. I can help you discover books across our catalogue, check your active loan due dates, and explain circulation and fine policies.`,
      books: [],
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const promptChips = [
    'What are my active loans and due dates?',
    'Find books on computer science',
    'What is the library fine policy?',
    'Recommend popular books on AI'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/chat', { message: text });
      if (res.success && res.data) {
        const assistantMsg = {
          id: Math.random().toString(36).substr(2, 9),
          role: 'assistant',
          content: res.data.message,
          books: res.data.books || [],
          mode: res.data.mode,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(res.message || 'Could not fetch response');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          role: 'assistant',
          content: `I encountered an issue connecting to the library index: ${err.message}. Please try again shortly.`,
          books: [],
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#080B12] shadow-2xl flex flex-col border-l border-[#232A3B] text-white">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#232A3B] flex items-center justify-between bg-[#151A24]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF4B4B] to-[#8B5CF6] text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>AI Library Assistant</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Grounded in university catalogue & policies</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-3 bg-[#0D111A] border-b border-[#232A3B] overflow-x-auto flex gap-2 no-scrollbar">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                disabled={loading}
                className="shrink-0 text-[11px] font-bold bg-[#151A24] hover:bg-[#FF4B4B]/20 hover:text-[#FF4B4B] text-slate-300 border border-[#232A3B] px-3 py-1.5 rounded-full transition"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] text-white'
                      : 'bg-[#151A24] text-[#8B5CF6] border border-[#232A3B]'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] text-white rounded-br-none text-left shadow-md'
                        : 'bg-[#151A24] text-slate-200 border border-[#232A3B] rounded-bl-none text-left whitespace-pre-line'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Recommended Books Cards if present */}
                  {msg.books && msg.books.length > 0 && (
                    <div className="mt-3 space-y-2 text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Matched Titles:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.books.map((b) => (
                          <Link
                            key={b._id}
                            to={`/books/${b._id}`}
                            onClick={onClose}
                            className="flex items-center gap-3 p-2.5 bg-[#151A24] rounded-xl border border-[#232A3B] hover:border-[#FF4B4B]/50 transition group"
                          >
                            <img
                              src={b.coverImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200'}
                              alt={b.title}
                              className="w-10 h-14 object-cover rounded shrink-0 border border-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-white group-hover:text-[#FF4B4B] truncate transition-colors">
                                {b.title}
                              </h5>
                              <p className="text-[11px] text-slate-400 truncate">
                                {Array.isArray(b.authors) ? b.authors.join(', ') : b.authors}
                              </p>
                              <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">
                                {b.availableCopies > 0 ? `${b.availableCopies} available` : 'Loaned Out'}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#FF4B4B] group-hover:translate-x-0.5 transition shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="block text-[10px] text-slate-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#151A24] text-[#8B5CF6] flex items-center justify-center shrink-0 border border-[#232A3B]">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#151A24] p-3 rounded-2xl rounded-bl-none text-slate-400 text-xs flex items-center gap-2 border border-[#232A3B]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF4B4B]" />
                  Consulting library catalogue and policy rules...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3.5 border-t border-[#232A3B] bg-[#151A24]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about books, policies, or loans..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#080B12] text-white rounded-xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF4B4B] to-[#8B5CF6] hover:scale-105 disabled:opacity-40 text-white transition shadow-md shadow-[#FF4B4B]/30 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Libratech Assistant answers from live database records and circulation rules.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssistantChatDrawer;
