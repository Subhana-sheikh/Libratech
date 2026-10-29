import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, ArrowRight, Loader2, BookOpen, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';

export const StudentAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to the Libratech Library Assistant! I can help you search our university catalogue, check your active loan due dates, and understand borrowing policies.`,
      books: [],
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const promptChips = [
    'What are my active loans and due dates?',
    'What are the loan duration and fine policies?',
    'Find books on computer science',
    'Recommend popular books on AI'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            role: 'assistant',
            content: res.data.message,
            books: res.data.books || [],
            mode: res.data.mode,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(res.message || 'Could not fetch response');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          role: 'assistant',
          content: `Failed to consult library knowledge base: ${err.message}`,
          books: [],
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-[#FF4B4B]" />
            AI Library Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grounded in real catalogue records, shelf inventory, and university circulation policies.
          </p>
        </div>

        <Badge variant="info">Catalogue & Policy Grounded</Badge>
      </div>

      <Card padding="p-0" className="overflow-hidden flex flex-col h-[650px] shadow-2xl border border-[#232A3B] bg-[#151A24]">
        
        {/* Quick prompt chips */}
        <div className="p-3 bg-[#080B12] border-b border-[#232A3B] flex gap-2 overflow-x-auto no-scrollbar">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              disabled={loading}
              className="shrink-0 text-xs font-medium bg-[#151A24] hover:bg-[#FF4B4B]/20 hover:text-[#FF4B4B] text-slate-300 border border-[#232A3B] px-3 py-1.5 rounded-full transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#080B12]/80">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-[#FF4B4B] text-white shadow-xs'
                    : 'bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`inline-block p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#FF4B4B] to-[#E03E3E] text-white rounded-br-none text-left'
                      : 'bg-[#151A24] text-slate-200 rounded-bl-none text-left whitespace-pre-line border border-[#232A3B]'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Book recommendations preview cards */}
                {msg.books && msg.books.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {msg.books.map((b) => (
                      <Link
                        key={b._id}
                        to={`/books/${b._id}`}
                        className="flex items-center gap-3 p-2.5 bg-[#151A24] rounded-xl border border-[#232A3B] hover:border-[#FF4B4B] hover:shadow-xs transition-all group"
                      >
                        <div className="w-10 h-14 bg-[#080B12] rounded overflow-hidden shrink-0 border border-[#232A3B]">
                          {b.coverImageUrl ? (
                            <img src={b.coverImageUrl} alt={b.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#FF4B4B] bg-[#FF4B4B]/10">
                              {b.title.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-semibold text-white group-hover:text-[#FF4B4B] truncate transition-colors">
                            {b.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 truncate">
                            {Array.isArray(b.authors) ? b.authors.join(', ') : b.authors}
                          </p>
                          <Badge
                            variant={b.availableCopies > 0 ? 'success' : 'danger'}
                            size="sm"
                            className="mt-1"
                          >
                            {b.availableCopies > 0 ? `${b.availableCopies} available` : 'Checked out'}
                          </Badge>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#FF4B4B] shrink-0 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}

                <span className="block text-[10px] text-slate-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/20 text-[#A78BFA] flex items-center justify-center shrink-0 border border-[#8B5CF6]/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-[#151A24] p-4 rounded-2xl rounded-bl-none text-slate-400 text-xs flex items-center gap-2 border border-[#232A3B]">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF4B4B]" />
                Searching catalogue index and library policies...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input form */}
        <div className="p-3 sm:p-4 bg-[#151A24] border-t border-[#232A3B]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question about books, due dates, or borrowing rules..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm bg-[#080B12] text-white rounded-xl border border-[#232A3B] focus:outline-none focus:border-[#FF4B4B] placeholder-slate-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={!inputMessage.trim()}
              icon={Send}
            >
              Send
            </Button>
          </form>
          <p className="text-[11px] text-slate-500 text-center mt-2">
            Recommendations are informational; official circulation records remain authoritative.
          </p>
        </div>

      </Card>
    </div>
  );
};

export default StudentAssistantPage;
