
let conversations = [
  {
    id: 'conv1',
    type: 'dm',
    participants: ['admin', 'teacher1'],
    messages: [
      { id: 'msg1', sender: 'teacher1', text: 'Just a reminder, I have a parent-teacher meeting scheduled for this Friday.', timestamp: new Date(Date.now() - 5 * 60000) },
      { id: 'msg2', sender: 'admin', text: 'Thank you for the update, Mr. Smith. It has been noted.', timestamp: new Date(Date.now() - 4 * 60000) },
    ],
    lastMessage: 'Thank you for the update, Mr. Smith. It has been noted.',
    lastMessageTime: '10:32 AM',
    unreadCount: 0,
    pinned: false,
  },
  {
    id: 'conv2',
    type: 'dm',
    participants: ['admin', 'parent1'],
    messages: [
      { id: 'msg3', sender: 'parent1', text: 'Hello, I wanted to inquire about the school fee payment deadline.', timestamp: new Date(Date.now() - 24 * 60 * 60000) },
      { id: 'msg4', sender: 'admin', text: 'Hello Mrs. Doe, the deadline for this term is October 25th. You can pay online via the portal.', timestamp: new Date(Date.now() - 24 * 60 * 60000) },
       { id: 'msg5', sender: 'parent1', text: 'Perfect, thank you!', timestamp: new Date(Date.now() - 24 * 60 * 60000) },
    ],
    lastMessage: 'Perfect, thank you!',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    pinned: true,
  },
  {
    id: 'conv3',
    name: "Grade 10 Teachers",
    type: 'group',
    participants: ['admin', 'teacher1', 'teacher2'],
    messages: [
      { id: 'msg6', sender: 'admin', text: 'Hi team, please submit your final grades by EOD Friday.', timestamp: new Date(Date.now() - 10 * 60000) },
      { id: 'msg7', sender: 'teacher1', text: 'Will do. I have a few more papers to grade.', timestamp: new Date(Date.now() - 9 * 60000) },
      { id: 'msg8', sender: 'teacher2', text: 'Noted. I should have mine in by 3pm.', timestamp: new Date(Date.now() - 8 * 60000) },
    ],
    lastMessage: 'Noted. I should have mine in by 3pm.',
    lastMessageTime: '10:45 AM',
    unreadCount: 0,
    pinned: false,
  },
];

// This is a simple in-memory store. 
// In a real app, you would use a database.
export const getConversations = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('conversations');
        if (stored) {
            // Make sure to parse dates correctly
            const parsed = JSON.parse(stored);
            return parsed.map((conv: any) => ({
                ...conv,
                messages: conv.messages.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }))
            }));
        }
    }
    return conversations;
};

export const setConversations = (newConversations: any[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('conversations', JSON.stringify(newConversations));
    }
};

export const addConversation = (newConv: any, isUpdate: boolean = false) => {
    let currentConversations = getConversations();
    if(isUpdate) {
        currentConversations = currentConversations.filter(c => c.id !== newConv.id);
    }
    const updatedConversations = [newConv, ...currentConversations];
    setConversations(updatedConversations);
}
