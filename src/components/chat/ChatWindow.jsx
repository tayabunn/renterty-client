'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  User, 
  CheckCheck,
  Bot,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getConversationMessages, sendMessage, getSmartReplies } from '../../lib/services';

export default function ChatWindow({ 
  isOpen, 
  onClose, 
  recipientId, 
  recipientName, 
  propertyId, 
  propertyTitle, 
  currentUser 
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [smartReplies, setSmartReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const messagesEndRef = useRef(null);

  const conversationId = [currentUser?.id || 'guest', recipientId].sort().join('_') + `_${propertyId || 'general'}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const msgs = await getConversationMessages(conversationId);
      setMessages(msgs || []);
      
      // If there are messages, fetch smart replies for the latest message
      if (msgs && msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg.senderId !== currentUser?.id) {
          fetchAiSuggestions(lastMsg.content);
        }
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiSuggestions = async (lastContent) => {
    setLoadingReplies(true);
    try {
      const res = await getSmartReplies({
        lastMessage: lastContent,
        propertyTitle: propertyTitle || 'Rental Listing',
        role: currentUser?.role || 'Tenant'
      });
      setSmartReplies(res.suggestions || []);
    } catch (err) {
      console.warn('Smart replies error:', err);
    } finally {
      setLoadingReplies(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !recipientId) return;
    setLoading(true);
    fetchMessages();

    // Polling every 5 seconds for new messages
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [isOpen, recipientId, propertyId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim()) return;

    setSending(true);
    try {
      const res = await sendMessage({
        conversationId,
        recipientId,
        recipientName: recipientName || 'Host',
        propertyId,
        propertyTitle,
        content: text.trim()
      });
      setMessages(prev => [...prev, res.data]);
      setInputText('');
      setSmartReplies([]);
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg h-[600px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              {recipientName ? recipientName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 id="chat-modal-title" className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {recipientName || 'Property Host'}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {propertyTitle || 'Direct In-App Messaging'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-slate-950/20">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mb-2"></div>
              <p className="text-xs text-slate-400">Loading conversation history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              Start the conversation regarding <span className="font-semibold text-slate-600 dark:text-slate-300">{propertyTitle}</span>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div
                  key={msg._id || i}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* AI Smart Replies Suggestions Bar */}
        {smartReplies.length > 0 && (
          <div className="px-4 py-2 bg-emerald-50/50 dark:bg-emerald-950/20 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>AI Smart Replies:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {smartReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(reply)}
                  className="text-left text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex-shrink-0"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input Box */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
