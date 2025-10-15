import express from 'express';
import {
  sendMessage,
  getConversations,
  getThreadMessages,
  markAsRead,
  getUnreadCount,
  deleteMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All message routes require authentication
router.use(protect);

// Send a new message
router.post('/', sendMessage);

// Get all conversations
router.get('/conversations', getConversations);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Get messages in a thread
router.get('/thread/:threadId', getThreadMessages);

// Mark thread as read
router.put('/read/:threadId', markAsRead);

// Delete a message
router.delete('/:messageId', deleteMessage);

export default router;

