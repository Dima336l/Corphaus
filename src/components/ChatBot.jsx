import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message when first opened
    if (isOpen && messages.length === 0) {
      const greeting = user
        ? `Hi ${user.name}! 👋 I'm here to help you with Corphaus. Ask me anything!`
        : `Hi there! 👋 I'm the Corphaus assistant. How can I help you today?`;
      
      setMessages([{
        type: 'bot',
        text: greeting,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, user]);

  // Rule-based response system
  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Pricing questions
    if (msg.includes('price') || msg.includes('cost') || msg.includes('pricing') || msg.includes('how much')) {
      return {
        text: `💰 **Corphaus Pricing:**\n\n**Free Plan:** £0/month\n• 1 property listing (Landlords) or 1 wanted ad (Businesses)\n• Browse all listings\n• Contact details blurred\n\n**Pro Plan:** £29/month\n• Unlimited listings\n• Full contact details visible\n• Priority support\n\n[View Full Pricing](/pricing)`,
        suggestions: ['What is Pro plan?', 'How to upgrade?', 'Free trial?']
      };
    }

    // Upgrade questions
    if (msg.includes('upgrade') || msg.includes('pro')) {
      const response = user
        ? user.isPaid
          ? `You're already on the Pro plan! 🌟 Enjoy unlimited listings and full contact access.`
          : `To upgrade to Pro:\n1. Go to [Pricing](/pricing)\n2. Click "Upgrade to Pro"\n3. Complete payment\n4. Enjoy unlimited access! 🚀`
        : `To upgrade, please [log in](/login) first, then visit our [Pricing](/pricing) page!`;
      
      return {
        text: response,
        suggestions: ['Pricing details', 'What is Pro?', 'How to login?']
      };
    }

    // Account type questions
    if (msg.includes('landlord') && msg.includes('business')) {
      return {
        text: `🏠 **Landlord vs Business:**\n\n**Landlord Account:**\n• List properties for rent\n• Browse wanted ads from businesses\n• See who's looking for properties\n\n**Business Account:**\n• Post wanted ads (what you're looking for)\n• Browse available properties\n• Find landlords with suitable properties\n\nChoose based on what you need! 🎯`,
        suggestions: ['How to signup?', 'Can I have both?', 'Pricing']
      };
    }

    // Landlord specific
    if (msg.includes('landlord') || msg.includes('list property')) {
      return {
        text: `🏠 **For Landlords:**\n\nList your properties and connect with businesses looking for rentals.\n\n**Free Plan:** 1 property\n**Pro Plan:** Unlimited properties + see full contact details\n\n${user?.role === 'Landlord' ? '[List a Property](/add-property)' : '[Sign up as Landlord](/signup)'}`,
        suggestions: ['Pricing', 'How to list?', 'What can I list?']
      };
    }

    // Business specific
    if (msg.includes('business') || msg.includes('wanted ad')) {
      return {
        text: `💼 **For Businesses:**\n\nPost wanted ads to tell landlords what you're looking for.\n\n**Free Plan:** 1 wanted ad\n**Pro Plan:** Unlimited ads + see full contact details\n\n${user?.role === 'Business' ? '[Post Wanted Ad](/add-wanted-ad)' : '[Sign up as Business](/signup)'}`,
        suggestions: ['Pricing', 'How to post?', 'What can I post?']
      };
    }

    // Login/Signup
    if (msg.includes('login') || msg.includes('log in') || msg.includes('sign in')) {
      return {
        text: user
          ? `You're already logged in as ${user.name}! 👋`
          : `To log in:\n1. Click [Log In](/login)\n2. Enter your email and password\n3. Start using Corphaus! 🚀\n\nDon't have an account? [Sign up here](/signup)`,
        suggestions: ['How to signup?', 'Forgot password?', 'Test accounts']
      };
    }

    if (msg.includes('signup') || msg.includes('sign up') || msg.includes('register') || msg.includes('create account')) {
      return {
        text: `📝 **Sign Up:**\n\n1. Go to [Sign Up](/signup)\n2. Choose account type:\n   • Landlord (list properties)\n   • Business (post wanted ads)\n3. Fill in your details\n4. Start for free!\n\nFree plan includes 1 listing. Upgrade anytime for unlimited! 🚀`,
        suggestions: ['Landlord vs Business?', 'Pricing', 'Test accounts']
      };
    }

    // Contact details blur
    if (msg.includes('blur') || msg.includes('contact') || msg.includes('phone') || msg.includes('email visible')) {
      return {
        text: `🔒 **Contact Details:**\n\n**Free Plan:** Contact details are blurred for privacy\n**Pro Plan:** Full contact details visible\n\n${user?.isPaid ? "You're on Pro - you can see all contacts! ✅" : "Upgrade to Pro to see full contact information! [View Pricing](/pricing)"}`,
        suggestions: ['Upgrade to Pro', 'Pricing', 'Why upgrade?']
      };
    }

    // Limits
    if (msg.includes('limit') || msg.includes('how many')) {
      return {
        text: `📊 **Listing Limits:**\n\n**Free Plan:**\n• Landlords: 1 property\n• Businesses: 1 wanted ad\n\n**Pro Plan:**\n• Unlimited properties\n• Unlimited wanted ads\n\n${user ? (user.isPaid ? "You have unlimited listings! 🎉" : "You're on the free plan (1 listing). [Upgrade for unlimited](/pricing)") : "[Sign up](/signup) to start listing!"}`,
        suggestions: ['Upgrade to Pro', 'Pricing', 'How to upgrade?']
      };
    }

    // How it works
    if (msg.includes('how') && (msg.includes('work') || msg.includes('use') || msg.includes('start'))) {
      return {
        text: `🎯 **How Corphaus Works:**\n\n**For Landlords:**\n1. List your properties\n2. Browse wanted ads from businesses\n3. Connect with interested businesses\n\n**For Businesses:**\n1. Post wanted ads (what you need)\n2. Browse available properties\n3. Connect with landlords\n\n**It's that simple!** 🚀`,
        suggestions: ['Sign up', 'Pricing', 'Landlord vs Business?']
      };
    }

    // Test accounts
    if (msg.includes('test') && msg.includes('account')) {
      return {
        text: `🧪 **Test Accounts:**\n\nYou can try these test accounts:\n\n**Free Landlord:**\nemail: landlord@test.com\npassword: password123\n\n**Free Business:**\nemail: business@test.com\npassword: password123\n\n**Pro Landlord:**\nemail: landlord.pro@test.com\npassword: password123\n\n**Pro Business:**\nemail: business.pro@test.com\npassword: password123`,
        suggestions: ['How to login?', 'Landlord vs Business?', 'What is Pro?']
      };
    }

    // Help / What can you do
    if (msg.includes('help') || msg.includes('what can you')) {
      return {
        text: `💡 **I can help you with:**\n\n• Pricing & plans\n• How Corphaus works\n• Landlord vs Business accounts\n• Listing properties or wanted ads\n• Upgrading to Pro\n• Contact details & privacy\n• Login & signup help\n• Test accounts\n\nJust ask me anything! 😊`,
        suggestions: ['Pricing', 'How it works?', 'Test accounts', 'Sign up']
      };
    }

    // Greetings
    if (msg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return {
        text: `Hello! 👋 How can I help you with Corphaus today?`,
        suggestions: ['How it works?', 'Pricing', 'Sign up', 'Test accounts']
      };
    }

    // Thanks
    if (msg.includes('thank') || msg.includes('thanks')) {
      return {
        text: `You're welcome! 😊 Is there anything else I can help you with?`,
        suggestions: ['How it works?', 'Pricing', 'Test accounts']
      };
    }

    // Default response with suggestions based on user state
    const defaultSuggestions = user
      ? user.role === 'Landlord'
        ? ['List property', 'Browse wanted ads', 'Upgrade to Pro', 'Pricing']
        : ['Post wanted ad', 'Browse properties', 'Upgrade to Pro', 'Pricing']
      : ['How it works?', 'Sign up', 'Pricing', 'Test accounts'];

    return {
      text: `I'm not sure about that, but I can help you with:\n\n• Pricing & plans\n• How Corphaus works\n• Account types (Landlord/Business)\n• Listing properties or wanted ads\n• Upgrading to Pro\n\nWhat would you like to know? 😊`,
      suggestions: defaultSuggestions
    };
  };

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(textToSend);
      const botMessage = {
        type: 'bot',
        text: response.text,
        suggestions: response.suggestions,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 500 + Math.random() * 500); // Random delay 500-1000ms
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            ?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">Corphaus Assistant</h3>
                <p className="text-xs text-blue-100">Online • Here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm">
                      {message.text.split('\n').map((line, i) => {
                        // Parse markdown: links, bold, bullets
                        const parseMarkdown = (text) => {
                          const elements = [];
                          let remaining = text;
                          let key = 0;

                          while (remaining.length > 0) {
                            // Match bold **text**
                            const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
                            if (boldMatch) {
                              elements.push(
                                <strong key={key++} className="font-bold">
                                  {boldMatch[1]}
                                </strong>
                              );
                              remaining = remaining.slice(boldMatch[0].length);
                              continue;
                            }

                            // Match links [text](url)
                            const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
                            if (linkMatch) {
                              elements.push(
                                <button
                                  key={key++}
                                  onClick={() => {
                                    setIsOpen(false);
                                    navigate(linkMatch[2]);
                                  }}
                                  className={`underline font-semibold ${
                                    message.type === 'user' ? 'text-white' : 'text-blue-600'
                                  } hover:opacity-80 cursor-pointer bg-transparent border-none p-0`}
                                >
                                  {linkMatch[1]}
                                </button>
                              );
                              remaining = remaining.slice(linkMatch[0].length);
                              continue;
                            }

                            // Regular text (add one character at a time until we hit markdown)
                            const nextSpecial = remaining.search(/(\*\*|\[)/);
                            if (nextSpecial === -1) {
                              // No more special characters
                              elements.push(<span key={key++}>{remaining}</span>);
                              break;
                            } else if (nextSpecial > 0) {
                              // Add text before next special character
                              elements.push(<span key={key++}>{remaining.slice(0, nextSpecial)}</span>);
                              remaining = remaining.slice(nextSpecial);
                            } else {
                              // Special character that didn't match - treat as regular text
                              elements.push(<span key={key++}>{remaining[0]}</span>);
                              remaining = remaining.slice(1);
                            }
                          }

                          return elements;
                        };

                        // Check if line is a bullet point
                        const bulletMatch = line.match(/^([•✅❌➕💼🏠📊🔒💰📝🎯])\s+(.+)$/);
                        if (bulletMatch) {
                          return (
                            <div key={i} className="flex gap-2 my-0.5">
                              <span>{bulletMatch[1]}</span>
                              <span className="flex-1">{parseMarkdown(bulletMatch[2])}</span>
                            </div>
                          );
                        }

                        // Check if line is indented (sub-bullet)
                        const indentMatch = line.match(/^(\s+)([•\-])\s+(.+)$/);
                        if (indentMatch) {
                          return (
                            <div key={i} className="flex gap-2 ml-4 my-0.5">
                              <span className="text-gray-400">•</span>
                              <span className="flex-1">{parseMarkdown(indentMatch[3])}</span>
                            </div>
                          );
                        }

                        // Regular line
                        return (
                          <div key={i} className={line.trim() === '' ? 'h-2' : ''}>
                            {parseMarkdown(line)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {message.type === 'bot' && message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-2">
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

