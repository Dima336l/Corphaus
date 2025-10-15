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
  const conversations = await this.aggregate([
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(userId) },
          { recipient: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$threadId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$recipient', new mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$read', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);

  // Populate user and related item details
  await this.populate(conversations, [
    {
      path: 'lastMessage.sender',
      select: 'name email role'
    },
    {
      path: 'lastMessage.recipient',
      select: 'name email role'
    },
    {
      path: 'lastMessage.relatedProperty',
      select: 'title address price'
    },
    {
      path: 'lastMessage.relatedWantedAd',
      select: 'title location budget'
    }
  ]);

  return conversations;
};

const Message = mongoose.model('Message', messageSchema);

export default Message;

