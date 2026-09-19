'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  User, 
  Clock, 
  ChevronRight, 
  Send, 
  Sparkles, 
  Search, 
  Paperclip, 
  Smile, 
  CheckCheck, 
  Bot, 
  Phone, 
  Video, 
  Building, 
  MapPin, 
  ShieldCheck, 
  Check, 
  FileText,
  Image as ImageIcon,
  MoreVertical,
  Circle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getConversations, sendMessage } from '../../lib/services';
import Link from 'next/link';

const DEMO_CONVERSATIONS = [
  {
    conversationId: 'demo-conv-01',
    otherUserId: 'user-sarah-101',
    otherUserName: 'Sarah Jenkins',
    otherUserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    role: 'Property Manager',
    isOnline: true,
    propertyId: 'prop-01',
    propertyTitle: 'The Grand Manhattan Sky Penthouse',
    propertyLocation: 'Soho, New York, NY',
    propertyRent: '$4,200/mo',
    lastMessage: 'Elevator #2 is reserved for moving day. Smart lock PIN 9482# activates at 8:00 AM.',
    lastMessageTime: '10m ago',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        sender: 'other',
        content: 'Hi Alex! Welcome to Renterty. I have prepared your digital move-in packet for Suite 18B.',
        time: '10:14 AM'
      },
      {
        id: 'msg-2',
        sender: 'me',
        content: 'Thank you Sarah! Could you confirm what time elevator access is reserved for moving day?',
        time: '10:20 AM'
      },
      {
        id: 'msg-3',
        sender: 'other',
        content: 'Elevator #2 is reserved exclusively for you from 9:00 AM to 1:00 PM on the 12th. Smart lock PIN 9482# activates at 8:00 AM.',
        time: '10:25 AM'
      }
    ],
    smartReplies: [
      'Could you send parking spot instructions?',
      'Where is the parcel locker located?',
      'Thanks Sarah, all set for move-in!'
    ]
  },
  {
    conversationId: 'demo-conv-02',
    otherUserId: 'user-marcus-102',
    otherUserName: 'Marcus Vance',
    otherUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    role: 'Villa Host',
    isOnline: true,
    propertyId: 'prop-02',
    propertyTitle: 'Coastal Miami Waterfront Villa',
    propertyLocation: 'South Beach, Miami, FL',
    propertyRent: '$5,800/mo',
    lastMessage: 'Private slip #4 is included. Deep water dock with 50-amp shore power.',
    lastMessageTime: '2h ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        sender: 'other',
        content: 'Hello Alex! Confirmed your seasonal lease reservation for the South Beach Villa.',
        time: 'Yesterday'
      },
      {
        id: 'msg-2',
        sender: 'me',
        content: 'Thanks Marcus! Is the boat dock available for weekend docking?',
        time: 'Yesterday'
      },
      {
        id: 'msg-3',
        sender: 'other',
        content: 'Private slip #4 is included. Deep water dock with 50-amp shore power.',
        time: '8:45 AM'
      }
    ],
    smartReplies: [
      'Are pool heaters enabled?',
      'Is high-speed Wi-Fi active at the dock?',
      'Sounds fantastic, thank you Marcus!'
    ]
  },
  {
    conversationId: 'demo-conv-03',
    otherUserId: 'user-ai-103',
    otherUserName: 'Renterty AI Concierge',
    otherUserAvatar: null,
    isBot: true,
    role: '24/7 AI Resident Assistant',
    isOnline: true,
    propertyId: 'prop-ai',
    propertyTitle: 'Renterty AI Resident Care',
    propertyLocation: 'Automated 24/7 Support',
    propertyRent: 'Included Free',
    lastMessage: 'You can access verified Stripe receipts anytime in the My Bookings tab.',
    lastMessageTime: '1d ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        sender: 'other',
        content: '👋 Hello Alex! I am your 24/7 Renterty AI Resident Concierge. I can help with rent receipts, emergency maintenance dispatch, lease terms, or neighborhood tips.',
        time: '2 days ago'
      },
      {
        id: 'msg-2',
        sender: 'me',
        content: 'How do I download my monthly rent tax receipt?',
        time: 'Yesterday'
      },
      {
        id: 'msg-3',
        sender: 'other',
        content: 'You can access verified Stripe receipts anytime in the My Bookings tab under "Escrow & Payment Receipts". Would you like me to guide you there?',
        time: 'Yesterday'
      }
    ],
    smartReplies: [
      'Can I report a repair ticket here?',
      'What are the building quiet hours?',
      'How do I renew my lease online?'
    ]
  },
  {
    conversationId: 'demo-conv-04',
    otherUserId: 'user-elena-104',
    otherUserName: 'Elena Rostova',
    otherUserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    role: 'Property Host',
    isOnline: false,
    propertyId: 'prop-03',
    propertyTitle: 'Sunset Boulevard Modern Loft',
    propertyLocation: 'West Hollywood, CA',
    propertyRent: '$3,400/mo',
    lastMessage: 'Looking forward to our virtual video tour on Thursday at 4 PM!',
    lastMessageTime: '2d ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        sender: 'other',
        content: 'Hi Alex! Thanks for scheduling a tour. I will be doing a live walkthrough of the West Hollywood loft on Thursday.',
        time: '2 days ago'
      },
      {
        id: 'msg-2',
        sender: 'me',
        content: 'Looking forward to seeing the sound insulation and balcony view!',
        time: '2 days ago'
      },
      {
        id: 'msg-3',
        sender: 'other',
        content: 'Looking forward to our virtual video tour on Thursday at 4 PM!',
        time: '2 days ago'
      }
    ],
    smartReplies: [
      'Can we test the Wi-Fi speed during the tour?',
      'Is tandem parking available?',
      'See you Thursday!'
    ]
  },
  {
    conversationId: 'demo-conv-05',
    otherUserId: 'user-tech-105',
    otherUserName: 'Apex Dispatch Services',
    otherUserAvatar: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=120',
    role: 'Certified Contractor',
    isOnline: true,
    propertyId: 'prop-04',
    propertyTitle: 'HVAC Triaging Dispatch (#TCK-4091)',
    propertyLocation: 'Soho Penthouse 18B',
    propertyRent: 'Dispatched',
    lastMessage: 'Technician Dave is en route for HVAC capacitor diagnosis. ETA ~12 mins.',
    lastMessageTime: '15m ago',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        sender: 'other',
        content: 'Renterty Dispatch: Master Tech Dave has been dispatched for Ticket #TCK-4091. ETA is 12 mins.',
        time: '15m ago'
      },
      {
        id: 'msg-2',
        sender: 'me',
        content: 'Thank you! Utility closet area is clear and accessible.',
        time: '12m ago'
      }
    ],
    smartReplies: [
      'Please call when you reach the lobby',
      'The door keypad PIN is 9482#',
      'Thank you for the quick dispatch!'
    ]
  }
];

export default function ChatList({ currentUser }) {
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState(DEMO_CONVERSATIONS[0].conversationId);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [isTypingDemo, setIsTypingDemo] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch real conversations if available, else keep rich demo
  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const data = await getConversations();
        if (Array.isArray(data) && data.length > 0) {
          // Merge with rich demo structure
          const merged = data.map((c, idx) => ({
            ...DEMO_CONVERSATIONS[idx % DEMO_CONVERSATIONS.length],
            ...c,
            conversationId: c.conversationId || `real-conv-${idx}`
          }));
          setConversations(merged);
        }
      } catch (err) {
        // Keep demo
      }
    };
    fetchConvs();
  }, []);

  const activeConv = conversations.find(c => c.conversationId === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTypingDemo]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      content: text.trim(),
      time: 'Just now'
    };

    // Update conversation state
    setConversations(prev => prev.map(c => {
      if (c.conversationId === activeConv.conversationId) {
        return {
          ...c,
          lastMessage: text.trim(),
          lastMessageTime: 'Just now',
          messages: [...(c.messages || []), newMsg]
        };
      }
      return c;
    }));

    setInputText('');

    // Simulate smart interactive reply after 1.2s
    setIsTypingDemo(true);
    setTimeout(() => {
      let replyContent = `Thanks for your message regarding "${activeConv.propertyTitle}". I have noted this and will follow up shortly!`;
      if (activeConv.isBot) {
        replyContent = `🤖 [Renterty AI]: I've processed your request for "${text.trim()}". All verified details have been updated in your tenant portal.`;
      } else if (activeConv.otherUserName.includes('Sarah')) {
        replyContent = `Got it, Alex! I've updated the building concierge notes for you. Let me know if you need anything else!`;
      } else if (activeConv.otherUserName.includes('Marcus')) {
        replyContent = `Sounds great! The boat slip and keys are all prepped. Enjoy Miami!`;
      } else if (activeConv.otherUserName.includes('Apex')) {
        replyContent = `Dave just arrived in the lobby and is heading up to Suite 18B now.`;
      }

      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: 'other',
        content: replyContent,
        time: 'Just now'
      };

      setConversations(prev => prev.map(c => {
        if (c.conversationId === activeConv.conversationId) {
          return {
            ...c,
            lastMessage: replyContent,
            lastMessageTime: 'Just now',
            messages: [...(c.messages || []), replyMsg]
          };
        }
        return c;
      }));
      setIsTypingDemo(false);
    }, 1200);
  };

  const filteredConversations = conversations.filter(c => {
    return (
      c.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-bold">
            <span className="size-2 rounded-full bg-teal-500 animate-pulse" />
            <span>End-to-End Encrypted Resident Messaging</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-teal-500" />
            <span>Direct Messages & AI Concierge</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Connect directly with verified property hosts, landlords, repair dispatchers, and 24/7 AI Concierge
          </p>
        </div>

        <button
          onClick={() => {
            const aiConv = conversations.find(c => c.isBot);
            if (aiConv) setActiveConvId(aiConv.conversationId);
            toast.success('Switched to 24/7 AI Resident Concierge!');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Main Conversational Workspace (2-Column Inbox) */}
      <div className="bg-white/95 dark:bg-zinc-900/95 border border-slate-200/80 dark:border-zinc-800/80 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] max-h-[780px]">
        {/* LEFT COLUMN: Conversation Threads List (4 cols) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800/80 flex flex-col bg-slate-50/50 dark:bg-zinc-950/40">
          {/* Search Box */}
          <div className="p-3.5 border-b border-slate-200/80 dark:border-zinc-800/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages or host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Conversation List Scrollable */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/50 p-2 space-y-1">
            {filteredConversations.map((conv) => {
              const isSelected = conv.conversationId === activeConv?.conversationId;
              return (
                <div
                  key={conv.conversationId}
                  onClick={() => {
                    setActiveConvId(conv.conversationId);
                    // Clear unread
                    setConversations(prev => prev.map(c => c.conversationId === conv.conversationId ? { ...c, unreadCount: 0 } : c));
                  }}
                  className={`p-3.5 rounded-lg transition-all duration-200 cursor-pointer flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 border border-teal-500/40 dark:border-teal-500/40 ring-1 ring-teal-500/20'
                      : 'hover:bg-white/80 dark:hover:bg-zinc-900/60 border border-transparent'
                  }`}
                >
                  {/* Avatar & Online status */}
                  <div className="relative shrink-0">
                    {conv.isBot ? (
                      <div className="size-11 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
                        <Bot className="w-5 h-5" />
                      </div>
                    ) : (
                      <img
                        src={conv.otherUserAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                        alt={conv.otherUserName}
                        className="size-11 rounded-lg object-cover border border-slate-200 dark:border-zinc-700"
                      />
                    )}
                    {conv.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
                    )}
                  </div>

                  {/* Thread details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-900 dark:text-white'}`}>
                        {conv.otherUserName}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">{conv.lastMessageTime}</span>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                      {conv.propertyTitle}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-zinc-300 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="size-2 rounded-full bg-teal-500 shrink-0 self-center" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Chat Thread & Live Composer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-zinc-900">
          {/* Active Chat Header */}
          <div className="p-4 px-6 border-b border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {activeConv.isBot ? (
                  <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                ) : (
                  <img
                    src={activeConv.otherUserAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                    alt={activeConv.otherUserName}
                    className="size-10 rounded-lg object-cover border border-slate-200 dark:border-zinc-700"
                  />
                )}
                {activeConv.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{activeConv.otherUserName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                    {activeConv.role}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                  <Building className="w-3 h-3 text-teal-500" />
                  <span className="truncate max-w-[280px]">{activeConv.propertyTitle}</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">({activeConv.propertyRent})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!activeConv.isBot && (
                <>
                  <button
                    onClick={() => toast.success(`Calling ${activeConv.otherUserName}...`)}
                    className="p-2 rounded-xl text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                    title="Voice Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toast.success(`Starting live video meeting with ${activeConv.otherUserName}...`)}
                    className="p-2 rounded-xl text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                    title="Video Call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Messages Thread Timeline */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30 dark:bg-zinc-950/30">
            {/* Property Reference Card */}
            <div className="p-3.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span className="text-slate-700 dark:text-zinc-300 font-medium">
                  Verified Resident Thread for <strong className="text-slate-900 dark:text-white">{activeConv.propertyTitle}</strong>
                </span>
              </div>
              <Link
                href="/#properties"
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                View Listing
              </Link>
            </div>

            {activeConv.messages?.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-3xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-br-none shadow-xs font-medium'
                        : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-slate-200/80 dark:border-zinc-700/80 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-teal-500" />}
                  </div>
                </div>
              );
            })}

            {isTypingDemo && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <span className="size-2 rounded-full bg-teal-500 animate-bounce" />
                <span className="size-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <span className="size-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium">{activeConv.otherUserName} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* AI Smart Replies Suggestions Bar */}
          {activeConv.smartReplies?.length > 0 && (
            <div className="px-4 py-2 bg-emerald-50/40 dark:bg-emerald-950/20 border-t border-slate-200/80 dark:border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Reply:</span>
              </span>
              {activeConv.smartReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(reply)}
                  className="px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-semibold text-slate-700 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Message Composer Input */}
          <div className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border-t border-slate-200/80 dark:border-zinc-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => toast.success('Attachment simulation: File attached (PDF / Lease / Photo)')}
                className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                title="Attach Document or Image"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={`Message ${activeConv.otherUserName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={sending || !inputText.trim()}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
