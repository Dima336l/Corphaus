import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { messagesAPI } from '../utils/api';

const MessageThread = ({ thread, onBack, onMessageSent }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const optionsRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadMessages();
  }, [thread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadMessages = async () => {
    if (!thread || !user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await messagesAPI.getThread(thread.threadId, user._id);
      setMessages(response.data || []);

      // Mark as read
      await messagesAPI.markAsRead(thread.threadId, user._id);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      const messageData = {
        recipientId: thread.otherUser._id,
        content: newMessage.trim(),
      };

      // Include related property or wanted ad if available
      if (thread.relatedItem && thread.relatedItemType === 'property') {
        messageData.relatedPropertyId = thread.relatedItem._id;
      } else if (thread.relatedItem && thread.relatedItemType === 'wantedAd') {
        messageData.relatedWantedAdId = thread.relatedItem._id;
      }

      const response = await messagesAPI.send(messageData, user._id);

      // Add new message to list
      setMessages([...messages, response.data]);
      setNewMessage('');

      // Notify parent to update conversation list
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const handleMarkAsRead = async () => {
    try {
      await messagesAPI.markAsRead(thread.threadId, user._id);
      setShowOptions(false);
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDeleteConversation = async () => {
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      try {
        // Note: This would require a delete conversation endpoint in the backend
        console.log('Delete conversation functionality would be implemented here');
        setShowOptions(false);
      } catch (err) {
        console.error('Failed to delete conversation:', err);
      }
    }
  };

  const formatTimestamp = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Thread Header */}
      <div className="border-b border-gray-200 px-4 py-3 bg-white">
        <div className="flex items-center gap-3">
          {/* Back button (mobile) */}
          <button
            onClick={onBack}
            className="md:hidden text-gray-600 hover:text-gray-900"
            aria-label="Back to conversations"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* User avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {thread.otherUser.name.charAt(0).toUpperCase()}
          </div>

          {/* User info */}
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{thread.otherUser.name}</h2>
            <p className="text-xs text-gray-500">
              {thread.otherUser.role}
              {thread.otherUser.email && (
                <span className="ml-2">• {thread.otherUser.email}</span>
              )}
            </p>
          </div>

          {/* Options menu */}
          <div className="relative" ref={optionsRef}>
            <button
              onClick={handleOptionsClick}
              className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
              aria-label="Options"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>

            {showOptions && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                <button
                  onClick={handleMarkAsRead}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as read
                </button>
                <button
                  onClick={handleDeleteConversation}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete conversation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related item */}
        {thread.relatedItem && (
          <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
            {/* Debug info - always show for now */}
            <div className="text-xs text-red-500 mb-2 p-2 bg-yellow-100 rounded">
              <strong>Debug Info:</strong><br/>
              relatedItem: {JSON.stringify(thread.relatedItem, null, 2)}<br/>
              relatedItemType: {thread.relatedItemType}<br/>
              streetAddress: "{thread.relatedItem.streetAddress}"<br/>
              postcode: "{thread.relatedItem.postcode}"<br/>
              propertyType: "{thread.relatedItem.propertyType}"
            </div>
            <p className="text-xs text-gray-500 mb-1">
              {thread.relatedItemType === 'property' ? 'Property:' : 'Wanted Ad:'}
            </p>
            <Link
              to={
                thread.relatedItemType === 'property'
                  ? `/properties/${thread.relatedItem._id}`
                  : `/wanted-ads/${thread.relatedItem._id}`
              }
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {thread.relatedItemType === 'property' 
                ? (thread.relatedItem.streetAddress && thread.relatedItem.postcode 
                    ? `${thread.relatedItem.streetAddress}, ${thread.relatedItem.postcode}`
                    : thread.relatedItem.propertyType || 'Property')
                : thread.relatedItem.title || 'Wanted Ad'
              }
            </Link>
            {thread.relatedItem.desiredRent && (
              <p className="text-xs text-gray-600 mt-1">
                💰 £{thread.relatedItem.desiredRent}
              </p>
            )}
            {thread.relatedItem.location && (
              <p className="text-xs text-gray-600 mt-1">
                📍 {thread.relatedItem.location}
              </p>
            )}
            {thread.relatedItem.desiredRent && (
              <p className="text-xs text-gray-600 mt-1">
                💰 £{thread.relatedItem.desiredRent}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading messages...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button onClick={loadMessages} className="mt-2 text-sm text-red-700 underline">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <p className="text-gray-500 mb-4">No messages yet. Start the conversation!</p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          messages.map((message) => {
            const isFromMe = message.sender._id === user._id;

            return (
              <div
                key={message._id}
                className={`mb-4 flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isFromMe ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isFromMe
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                  <div
                    className={`mt-1 flex items-center gap-2 text-xs text-gray-500 ${
                      isFromMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{formatTimestamp(message.createdAt)}</span>
                    {isFromMe && message.read && (
                      <span className="text-blue-600">• Read</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            rows="2"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send
              </>
            )}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default MessageThread;

