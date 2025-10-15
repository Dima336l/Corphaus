import Message from '../models/Message.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import WantedAd from '../models/WantedAd.js';

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    // DEBUG: Log what we receive
    console.log('=== SEND MESSAGE DEBUG ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('User from middleware:', req.user);
    console.log('========================');
    
    const { recipientId, content, relatedPropertyId, relatedWantedAdId } = req.body;

    // Validation
    if (!recipientId || !content) {
      console.log('VALIDATION FAILED - recipientId:', recipientId, 'content:', content);
      return res.status(400).json({ message: 'Recipient and message content are required' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ message: 'Message too long (max 2000 characters)' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Can't message yourself
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    // Verify related items exist if provided
    if (relatedPropertyId) {
      const property = await Property.findById(relatedPropertyId);
      if (!property) {
        return res.status(404).json({ message: 'Related property not found' });
      }
    }

    if (relatedWantedAdId) {
      const wantedAd = await WantedAd.findById(relatedWantedAdId);
      if (!wantedAd) {
        return res.status(404).json({ message: 'Related wanted ad not found' });
      }
    }

    // Generate thread ID
    const relatedItemId = relatedPropertyId || relatedWantedAdId || null;
    const threadId = Message.generateThreadId(req.user._id, recipientId, relatedItemId);

    // Create message
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content: content.trim(),
      relatedProperty: relatedPropertyId || null,
      relatedWantedAd: relatedWantedAdId || null,
      threadId
    });

    // Populate sender and recipient details
    await message.populate([
      { path: 'sender', select: 'name email role' },
      { path: 'recipient', select: 'name email role' },
      { path: 'relatedProperty', select: 'propertyType streetAddress postcode desiredRent' },
      { path: 'relatedWantedAd', select: 'title location budget' }
    ]);

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    console.log('Getting conversations for user:', req.user._id);
    const conversations = await Message.getConversations(req.user._id);
    console.log('Found conversations:', conversations.length);

    // Format response to include other participant info
    const formattedConversations = conversations.map(conv => {
      const lastMsg = conv.lastMessage;
      
      // Debug: Log the relatedProperty data
      console.log('DEBUG - lastMsg.relatedProperty:', lastMsg.relatedProperty);
      console.log('DEBUG - lastMsg.relatedWantedAd:', lastMsg.relatedWantedAd);
      
      // Safety check
      if (!lastMsg || !lastMsg.sender || !lastMsg.recipient) {
        console.error('Invalid message in conversation:', conv);
        return null;
      }
      
      const otherUser = lastMsg.sender._id.toString() === req.user._id.toString()
        ? lastMsg.recipient
        : lastMsg.sender;

      return {
        threadId: conv._id,
        otherUser: {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          role: otherUser.role
        },
        lastMessage: {
          content: lastMsg.content,
          createdAt: lastMsg.createdAt,
          isFromMe: lastMsg.sender._id.toString() === req.user._id.toString(),
          read: lastMsg.read
        },
        relatedItem: lastMsg.relatedProperty || lastMsg.relatedWantedAd || null,
        relatedItemType: lastMsg.relatedProperty ? 'property' : lastMsg.relatedWantedAd ? 'wantedAd' : null,
        unreadCount: conv.unreadCount
      };
    }).filter(conv => conv !== null); // Filter out invalid conversations

    res.json({
      success: true,
      count: formattedConversations.length,
      data: formattedConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Failed to fetch conversations', error: error.message });
  }
};

// @desc    Get messages in a specific thread
// @route   GET /api/messages/thread/:threadId
// @access  Private
export const getThreadMessages = async (req, res) => {
  try {
    const { threadId } = req.params;

    // Get all messages in this thread
    const messages = await Message.find({ threadId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .populate('relatedProperty', 'title address price images')
      .populate('relatedWantedAd', 'title location budget');

    // Verify user is part of this conversation
    if (messages.length > 0) {
      const firstMessage = messages[0];
      const isParticipant = 
        firstMessage.sender._id.toString() === req.user._id.toString() ||
        firstMessage.recipient._id.toString() === req.user._id.toString();

      if (!isParticipant) {
        return res.status(403).json({ message: 'You are not part of this conversation' });
      }
    }

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Get thread messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:threadId
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { threadId } = req.params;

    // Mark all unread messages in this thread where current user is recipient
    const result = await Message.updateMany(
      {
        threadId,
        recipient: req.user._id,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read',
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read', error: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      read: false
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to get unread count', error: error.message });
  }
};

// @desc    Delete a message (soft delete - only for sender)
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete their message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own messages' });
    }

    // Delete within 5 minutes of sending
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (message.createdAt < fiveMinutesAgo) {
      return res.status(403).json({ message: 'Messages can only be deleted within 5 minutes of sending' });
    }

    await message.deleteOne();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message', error: error.message });
  }
};

