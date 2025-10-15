import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Participants
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Message content
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  
  // What the message is about (optional - helps organize conversations)
  relatedProperty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    default: null
  },
  relatedWantedAd: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WantedAd',
    default: null
  },
  
  // Thread/conversation ID (combination of users + related item)
  threadId: {
    type: String,
    required: true,
    index: true
  },
  
  // Status
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ threadId: 1, createdAt: 1 });

// Generate thread ID (ensures same thread for both directions of conversation)
messageSchema.statics.generateThreadId = function(user1Id, user2Id, relatedItemId = null) {
  // Sort user IDs to ensure consistent thread ID regardless of who sends first
  const userIds = [user1Id.toString(), user2Id.toString()].sort();
  
  if (relatedItemId) {
    return `${userIds[0]}_${userIds[1]}_${relatedItemId}`;
  }
  return `${userIds[0]}_${userIds[1]}`;
};

// Get conversation summary (for listing all conversations)
messageSchema.statics.getConversations = async function(userId) {
  try {
    // Simpler approach: Get all unique thread IDs for this user
    const userIdObj = new mongoose.Types.ObjectId(userId);
    
    const messages = await this.find({
      $or: [
        { sender: userIdObj },
        { recipient: userIdObj }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name email role')
    .populate('recipient', 'name email role')
    .populate('relatedProperty', 'propertyType streetAddress postcode desiredRent')
    .populate('relatedWantedAd', 'title location budget');

    // Group by threadId and get the most recent message per thread
    const threadMap = new Map();
    
    for (const message of messages) {
      if (!threadMap.has(message.threadId)) {
        threadMap.set(message.threadId, {
          _id: message.threadId,
          lastMessage: message,
          unreadCount: 0
        });
      }
      
      // Count unread messages where user is recipient
      if (message.recipient._id.toString() === userId && !message.read) {
        const conv = threadMap.get(message.threadId);
        conv.unreadCount++;
      }
    }

    return Array.from(threadMap.values());
  } catch (error) {
    console.error('Error in getConversations:', error);
    return [];
  }
};

const Message = mongoose.model('Message', messageSchema);

export default Message;

