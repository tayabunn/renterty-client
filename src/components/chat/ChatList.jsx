'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Clock, ChevronRight } from 'lucide-react';
import { getConversations } from '../../lib/services';
import ChatWindow from './ChatWindow';

export default function ChatList({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  const fetchConvs = async () => {
    try {
      const data = await getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConvs();
    const interval = setInterval(fetchConvs, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-500" />
          Direct Messages ({conversations.length})
        </h3>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mb-2"></div>
          <p className="text-xs text-slate-400">Loading messages...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">No messages yet. Send a message directly from any listing page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conversations.map((conv) => (
            <div
              key={conv.conversationId}
              onClick={() => setActiveChat(conv)}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  {conv.otherUserName ? conv.otherUserName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {conv.otherUserName}
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-[10px] text-white font-bold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{conv.propertyTitle}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">{conv.lastMessage}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {activeChat && (
        <ChatWindow
          isOpen={true}
          onClose={() => {
            setActiveChat(null);
            fetchConvs();
          }}
          recipientId={activeChat.otherUserId}
          recipientName={activeChat.otherUserName}
          propertyId={activeChat.propertyId}
          propertyTitle={activeChat.propertyTitle}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
