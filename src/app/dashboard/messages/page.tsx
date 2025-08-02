
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search, Send, Menu, ArrowLeft } from "lucide-react";
import { NewMessageDialog } from "@/components/new-message-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

const users = {
  admin: { name: 'Admin', avatar: 'https://placehold.co/40x40.png', initials: 'AD', role: 'Admin', online: true },
  teacher1: { name: 'Mr. Smith', avatar: 'https://placehold.co/40x40.png', initials: 'MS', role: 'Teacher', online: true },
  student1: { name: 'John Doe', avatar: 'https://placehold.co/40x40.png', initials: 'JD', role: 'Student', online: false },
  parent1: { name: 'Jane Doe', avatar: 'https://placehold.co/40x40.png', initials: 'JD', role: 'Parent', online: true },
  teacher2: { name: 'Ms. Jones', avatar: 'https://placehold.co/40x40.png', initials: 'MJ', role: 'Teacher', online: false },
  student2: { name: 'Sarah Miller', avatar: 'https://placehold.co/40x40.png', initials: 'SM', role: 'Student', online: true },
};

const conversationsData = [
  {
    id: 'conv1',
    participants: ['admin', 'teacher1'],
    messages: [
      { sender: 'teacher1', text: 'Just a reminder, I have a parent-teacher meeting scheduled for this Friday.', timestamp: '10:30 AM' },
      { sender: 'admin', text: 'Thank you for the update, Mr. Smith. It has been noted.', timestamp: '10:32 AM' },
    ],
    lastMessage: 'Thank you for the update, Mr. Smith. It has been noted.',
    lastMessageTime: '10:32 AM',
    unreadCount: 0,
  },
  {
    id: 'conv2',
    participants: ['admin', 'parent1'],
    messages: [
      { sender: 'parent1', text: 'Hello, I wanted to inquire about the school fee payment deadline.', timestamp: 'Yesterday' },
      { sender: 'admin', text: 'Hello Mrs. Doe, the deadline for this term is October 25th. You can pay online via the portal.', timestamp: 'Yesterday' },
       { sender: 'parent1', text: 'Perfect, thank you!', timestamp: 'Yesterday' },
    ],
    lastMessage: 'Perfect, thank you!',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
  },
  {
    id: 'conv3',
    participants: ['admin', 'student1'],
    messages: [
      { sender: 'student1', text: 'Mr. Smith, I have a question about the history assignment.', timestamp: '9:00 AM' },
    ],
    lastMessage: 'I have a question about the history assignment.',
    lastMessageTime: '9:00 AM',
    unreadCount: 0,
  },
  {
    id: 'conv4',
    participants: ['admin', 'teacher2'],
    messages: [
       { sender: 'teacher2', text: 'The weekly report is ready for your review.', timestamp: '3 days ago' },
    ],
    lastMessage: 'The weekly report is ready for your review.',
    lastMessageTime: '3 days ago',
    unreadCount: 3,
  },
   {
    id: 'conv5',
    participants: ['admin', 'student2'],
    messages: [
      { sender: 'student2', text: 'I will be absent tomorrow due to a doctor\'s appointment.', timestamp: '4 days ago' },
      { sender: 'admin', text: 'Thanks for letting us know, Sarah.', timestamp: '4 days ago' },
    ],
    lastMessage: 'Thanks for letting us know, Sarah.',
    lastMessageTime: '4 days ago',
    unreadCount: 0,
  }
];


// This should be dynamically set based on the logged-in user
const CURRENT_USER_ID = 'admin';

export default function MessagesPage() {
    const [conversations, setConversations] = useState(conversationsData);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversationsData[0].id);
    const [searchTerm, setSearchTerm] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const isMobile = useIsMobile();
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    
    const handleNewMessage = (newConversation: any) => {
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversationId(newConversation.id);
        if(isMobile) setIsSidebarOpen(false);
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversationId) return;

        const newMessageObj = {
            sender: CURRENT_USER_ID,
            text: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversationId) {
                return {
                    ...conv,
                    messages: [...conv.messages, newMessageObj],
                    lastMessage: newMessage.trim(),
                    lastMessageTime: newMessageObj.timestamp,
                }
            }
            return conv;
        }));
        setNewMessage("");
    }
    
    const handleSelectConversation = (convId: string) => {
        setSelectedConversationId(convId);
        setConversations(prev => prev.map(conv => 
            conv.id === convId ? { ...conv, unreadCount: 0 } : conv
        ));
        if (isMobile) setIsSidebarOpen(false);
    };

    const filteredConversations = conversations.filter(conv => {
        const otherParticipantId = conv.participants.find(p => p !== CURRENT_USER_ID);
        if(!otherParticipantId) return false;
        const otherParticipant = users[otherParticipantId as keyof typeof users];
        return otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);
    
    const otherParticipantId = selectedConversation?.participants.find(p => p !== CURRENT_USER_ID);
    const otherParticipant = otherParticipantId ? users[otherParticipantId as keyof typeof users] : null;
    
    const showChatView = (!isMobile || (isMobile && !isSidebarOpen));
    const showSidebar = (!isMobile || (isMobile && isSidebarOpen));
    
    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col">
            <div>
                <h1 className="text-3xl font-bold font-headline">Messages</h1>
                <p className="text-muted-foreground">Communicate with students, teachers, and parents.</p>
            </div>
            <div className="flex-1 mt-6 border rounded-lg flex overflow-hidden">
                {showSidebar && (
                    <aside className={cn(
                        "border-r flex flex-col transition-all duration-300 ease-in-out",
                        isMobile ? "w-full" : "w-1/3 max-w-sm"
                    )}>
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Chats</h2>
                                <NewMessageDialog onNewMessage={handleNewMessage} currentUser={users[CURRENT_USER_ID]} allUsers={users} />
                            </div>
                            <div className="relative">
                                <Input placeholder="Search chats..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-2 space-y-1">
                                {filteredConversations.map(conv => {
                                    const otherParticipantId = conv.participants.find(p => p !== CURRENT_USER_ID);
                                    if(!otherParticipantId) return null;
                                    const participant = users[otherParticipantId as keyof typeof users];
                                    return (
                                        <button
                                            key={conv.id}
                                            className={cn(
                                                "w-full text-left p-3 rounded-lg flex items-center gap-4 transition-colors",
                                                selectedConversationId === conv.id ? "bg-muted" : "hover:bg-muted/50"
                                            )}
                                            onClick={() => handleSelectConversation(conv.id)}
                                        >
                                            <div className="relative">
                                                <Avatar>
                                                    <AvatarImage src={participant.avatar} alt={participant.name} data-ai-hint="user avatar" />
                                                    <AvatarFallback>{participant.initials}</AvatarFallback>
                                                </Avatar>
                                                {participant.online && (
                                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                                                )}
                                            </div>
                                            <div className="flex-1 truncate">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold">{participant.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{conv.lastMessageTime}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className={cn("text-sm text-muted-foreground truncate", conv.unreadCount > 0 && "font-bold text-foreground")}>{conv.lastMessage}</p>
                                                    {conv.unreadCount > 0 && (
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                            {conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </aside>
                )}
                 {showChatView && (
                    <main className="flex-1 flex flex-col">
                        {selectedConversation && otherParticipant ? (
                             <>
                                <header className="p-4 border-b flex items-center gap-4">
                                     {isMobile && (
                                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                    )}
                                     <div className="relative">
                                        <Avatar>
                                            <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} data-ai-hint="user avatar" />
                                            <AvatarFallback>{otherParticipant.initials}</AvatarFallback>
                                        </Avatar>
                                        {otherParticipant.online && (
                                             <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">{otherParticipant.name}</h2>
                                        <p className="text-sm text-muted-foreground">{otherParticipant.role}</p>
                                    </div>
                                     {isMobile && !isSidebarOpen && (
                                        <Button variant="ghost" size="icon" className="ml-auto">
                                            <Menu />
                                        </Button>
                                    )}
                                </header>
                                <ScrollArea className="flex-1 p-4 bg-muted/20">
                                    <div className="space-y-6">
                                        {selectedConversation.messages.map((msg, index) => (
                                            <div key={index} className={cn("flex gap-3", msg.sender === CURRENT_USER_ID ? "justify-end" : "justify-start")}>
                                                {msg.sender !== CURRENT_USER_ID && <Avatar className="h-8 w-8"><AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} data-ai-hint="user avatar" /><AvatarFallback>{otherParticipant.initials}</AvatarFallback></Avatar>}
                                                <div className={cn("max-w-xs md:max-w-md p-3 rounded-2xl", msg.sender === CURRENT_USER_ID ? "bg-primary text-primary-foreground rounded-br-none" : "bg-background rounded-bl-none")}>
                                                    <p className="text-sm">{msg.text}</p>
                                                    <p className={cn("text-xs mt-1 text-right", msg.sender === CURRENT_USER_ID ? "text-primary-foreground/70" : "text-muted-foreground")}>{msg.timestamp}</p>
                                                </div>
                                                 {msg.sender === CURRENT_USER_ID && <Avatar className="h-8 w-8"><AvatarImage src={users[CURRENT_USER_ID].avatar} alt={users[CURRENT_USER_ID].name} data-ai-hint="user avatar" /><AvatarFallback>{users[CURRENT_USER_ID].initials}</AvatarFallback></Avatar>}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <footer className="p-4 border-t">
                                     <form onSubmit={handleSendMessage}>
                                        <div className="relative">
                                            <Input placeholder="Type a message..." className="pr-12" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </form>
                                </footer>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                                Select a conversation to start chatting.
                            </div>
                        )}
                    </main>
                 )}
            </div>
        </div>
    );
}
