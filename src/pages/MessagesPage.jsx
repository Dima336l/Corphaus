import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { messagesAPI } from '../utils/api';
import MessageThread from '../components/MessageThread';

const MessagesPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if there's a thread in URL params
  const threadParam = searchParams.get('thread');

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]); // Only reload when user ID changes, not the whole user object

  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conversation => {
        const searchLower = searchQuery.toLowerCase();
        return (
          conversation.otherUser.name.toLowerCase().includes(searchLower) ||
          conversation.otherUser.email.toLowerCase().includes(searchLower) ||
          conversation.lastMessage.content.toLowerCase().includes(searchLower) ||
          (conversation.relatedItem && conversation.relatedItem.title.toLowerCase().includes(searchLower))
        );
      });
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery]);

  useEffect(() => {
    if (threadParam && conversations.length > 0) {
      const thread = conversations.find(c => c.threadId === threadParam);
      if (thread) {
        setSelectedThread(thread);
      }
    }
  }, [threadParam, conversations]);

  const loadConversations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await messagesAPI.getConversations(user._id);
      setConversations(response.data || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedThread(conversation);
    setSearchParams({ thread: conversation.threadId });
    // Prevent default scroll behavior by maintaining scroll position
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleBackToList = () => {
    setSelectedThread(null);
    setSearchParams({});
    loadConversations(); // Refresh conversations
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffInHours < 168) { // 7 days
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Messages</h1>
        <p className="text-gray-600 mb-6">Please log in to view your messages</p>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-600">
            {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
            {searchQuery && ` (filtered from ${conversations.length})`}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 container mx-auto flex overflow-hidden">
        {/* Conversations List */}
        <div
          className={`${
            selectedThread ? 'hidden md:block' : 'block'
          } w-full md:w-96 bg-white border-r border-gray-200 flex flex-col`}
        >
          {/* Search/Filter */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading conversations...</p>
              </div>
            )}

            {error && (
              <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadConversations}
                  className="mt-2 text-sm text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filteredConversations.length === 0 && conversations.length === 0 && (
              <div className="p-8 text-center">
                <svg
                  className="w-20 h-20 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start a conversation by contacting a property or wanted ad!
                </p>
                <Link
                  to={user.role === 'Landlord' ? '/wanted-ads' : '/properties'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  {user.role === 'Landlord' ? 'Browse Wanted Ads' : 'Browse Properties'}
                </Link>
              </div>
            )}

            {!loading && !error && filteredConversations.length === 0 && conversations.length > 0 && (
              <div className="p-8 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No conversations found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Clear search
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.threadId}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                    selectedThread?.threadId === conversation.threadId
                      ? 'bg-blue-50 border-l-4 border-l-blue-600 shadow-sm'
                      : 'hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm">
                        {conversation.otherUser.name.charAt(0).toUpperCase()}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            conversation.otherUser.role === 'Landlord'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              conversation.otherUser.role === 'Landlord'
                                ? 'bg-blue-500'
                                : 'bg-purple-500'
                            }`}
                          ></span>
                          {conversation.otherUser.role}
                        </span>
                      </div>

                      {conversation.relatedItem && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            🏠 {conversation.relatedItem.streetAddress ? 
                              `${conversation.relatedItem.streetAddress}, ${conversation.relatedItem.postcode}` : 
                              conversation.relatedItem.title || 'Property'
                            }
                          </span>
                        </div>
                      )}

                      <p
                        className={`text-sm truncate ${
                          conversation.unreadCount > 0 && !conversation.lastMessage.isFromMe
                            ? 'font-semibold text-gray-900'
                            : 'text-gray-600'
                        }`}
                      >
                        {conversation.lastMessage.isFromMe && (
                          <span className="text-gray-400">You: </span>
                        )}
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className={`${selectedThread ? 'block' : 'hidden md:block'} flex-1 bg-gray-50`}>
          {selectedThread ? (
            <MessageThread
              thread={selectedThread}
              onBack={handleBackToList}
              onMessageSent={loadConversations}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div>
                <svg
                  className="w-24 h-24 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a conversation from the list to view messages
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

