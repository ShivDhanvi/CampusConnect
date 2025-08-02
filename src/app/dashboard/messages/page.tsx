
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search, Send, Menu, ArrowLeft, MoreHorizontal, Trash2, Pencil, Users, AtSign } from "lucide-react";
import { NewMessageDialog } from "@/components/new-message-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const users = {
  admin: { id: 'admin', name: 'Admin', avatar: 'https://placehold.co/40x40.png', initials: 'AD', role: 'Admin', online: true },
  teacher1: { id: 'teacher1', name: 'Mr. Smith', avatar: 'https://placehold.co/40x40.png', initials: 'MS', role: 'Teacher', online: true },
  student1: { id: 'student1', name: 'John Doe', avatar: 'https://placehold.co/40x40.png', initials: 'JD', role: 'Student', online: false },
  parent1: { id: 'parent1', name: 'Jane Doe', avatar: 'https://placehold.co/40x40.png', initials: 'JD', role: 'Parent', online: true },
  teacher2: { id: 'teacher2', name: 'Ms. Jones', avatar: 'https://placehold.co/40x40.png', initials: 'MJ', role: 'Teacher', online: false },
  student2: { id: 'student2', name: 'Sarah Miller', avatar: 'https://placehold.co/40x40.png', initials: 'SM', role: 'Student', online: true },
};

const getInitialConversations = () => [
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
  },
];


// This should be dynamically set based on the logged-in user
const CURRENT_USER_ID = 'admin';

export default function MessagesPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const isMobile = useIsMobile();
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const [editingMessage, setEditingMessage] = useState<{ id: string, text: string } | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const initialData = getInitialConversations();
        setConversations(initialData);
        setSelectedConversationId(initialData[0].id);
    }, []);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
        }
    }, [selectedConversationId, conversations]);

    const handleNewMessage = (newConversation: any) => {
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversationId(newConversation.id);
        if(isMobile) setIsSidebarOpen(false);
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversationId) return;

        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversationId) {
                if (editingMessage) {
                    // Edit existing message
                    const updatedMessages = conv.messages.map(msg =>
                        msg.id === editingMessage.id ? { ...msg, text: newMessage.trim() } : msg
                    );
                    return { ...conv, messages: updatedMessages, lastMessage: updatedMessages[updatedMessages.length - 1].text };
                } else {
                    // Add new message
                    const newMessageObj = {
                        id: `msg${Date.now()}`,
                        sender: CURRENT_USER_ID,
                        text: newMessage.trim(),
                        timestamp: new Date()
                    };
                    return {
                        ...conv,
                        messages: [...conv.messages, newMessageObj],
                        lastMessage: newMessage.trim(),
                        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                }
            }
            return conv;
        }));
        setNewMessage("");
        setEditingMessage(null);
    };
    
    const handleSelectConversation = (convId: string) => {
        setSelectedConversationId(convId);
        setConversations(prev => prev.map(conv => 
            conv.id === convId ? { ...conv, unreadCount: 0 } : conv
        ));
        if (isMobile) setIsSidebarOpen(false);
    };

    const handleDeleteConversation = (convId: string) => {
        setConversations(prev => prev.filter(conv => conv.id !== convId));
        if (selectedConversationId === convId) {
            setSelectedConversationId(filteredConversations[0]?.id || null);
        }
    };
    
    const handleDeleteMessage = (messageId: string) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversationId) {
                return { ...conv, messages: conv.messages.filter(msg => msg.id !== messageId) };
            }
            return conv;
        }));
    };

    const handleEditMessage = (message: {id: string, text: string}) => {
        setEditingMessage(message);
        setNewMessage(message.text);
    };

    const handleMention = (username: string) => {
        setNewMessage(prev => `${prev}@${username} `);
    };

    const filteredConversations = conversations.filter(conv => {
        if (conv.type === 'group') {
            return conv.name?.toLowerCase().includes(searchTerm.toLowerCase());
        }
        const otherParticipantId = conv.participants.find(p => p !== CURRENT_USER_ID);
        if(!otherParticipantId) return false;
        const otherParticipant = users[otherParticipantId as keyof typeof users];
        return otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);
    
    const otherParticipantId = selectedConversation?.type === 'dm' ? selectedConversation?.participants.find(p => p !== CURRENT_USER_ID) : null;
    const otherParticipant = otherParticipantId ? users[otherParticipantId as keyof typeof users] : null;

    const getConversationDisplay = (conv: typeof conversations[0]) => {
        if (conv.type === 'group') {
            return {
                name: conv.name,
                avatar: null,
                initials: conv.name?.charAt(0).toUpperCase() || 'G',
                online: false,
            }
        }
        const otherId = conv.participants.find(p => p !== CURRENT_USER_ID) as keyof typeof users;
        return users[otherId];
    }

    const showChatView = (!isMobile || (isMobile && !isSidebarOpen));
    const showSidebar = (!isMobile || (isMobile && isSidebarOpen));

    if (!isClient) {
        return null; // or a loading skeleton
    }
    
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
                                    const displayInfo = getConversationDisplay(conv);
                                    if(!displayInfo) return null;
                                    return (
                                        <div key={conv.id} className="group relative">
                                        <button
                                            className={cn(
                                                "w-full text-left p-3 rounded-lg flex items-center gap-4 transition-colors",
                                                selectedConversationId === conv.id ? "bg-muted" : "hover:bg-muted/50"
                                            )}
                                            onClick={() => handleSelectConversation(conv.id)}
                                        >
                                            <div className="relative">
                                                <Avatar>
                                                    {conv.type === 'group' ? (
                                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                                            <Users className="h-5 w-5 text-muted-foreground"/>
                                                        </div>
                                                    ) : (
                                                        <AvatarImage src={displayInfo.avatar} alt={displayInfo.name} data-ai-hint="user avatar" />
                                                    )}
                                                    <AvatarFallback>{displayInfo.initials}</AvatarFallback>
                                                </Avatar>
                                                {displayInfo.online && (
                                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                                                )}
                                            </div>
                                            <div className="flex-1 truncate">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold">{displayInfo.name}</h3>
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
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="h-4 w-4 text-muted-foreground"/>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the chat history for "{displayInfo.name}". This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteConversation(conv.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </aside>
                )}
                 {showChatView && (
                    <main className="flex-1 flex flex-col">
                        {selectedConversation ? (
                             <>
                                <header className="p-4 border-b flex items-center gap-4">
                                     {isMobile && (
                                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                    )}
                                     <div className="relative">
                                        <Avatar>
                                            {selectedConversation.type === 'group' ? (
                                                 <div className="w-full h-full flex items-center justify-center bg-muted">
                                                    <Users className="h-5 w-5 text-muted-foreground"/>
                                                </div>
                                            ) : (
                                                <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} data-ai-hint="user avatar" />
                                            )}
                                            <AvatarFallback>{getConversationDisplay(selectedConversation)?.initials}</AvatarFallback>
                                        </Avatar>
                                        {otherParticipant?.online && (
                                             <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">{getConversationDisplay(selectedConversation)?.name}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedConversation.type === 'group' ? `${selectedConversation.participants.length} members` : otherParticipant?.role}
                                        </p>
                                    </div>
                                </header>
                                <ScrollArea className="flex-1 p-4 bg-muted/20" ref={scrollAreaRef}>
                                    <div className="space-y-6">
                                        {selectedConversation.messages.map((msg, index) => {
                                            const sender = users[msg.sender as keyof typeof users];
                                            const isCurrentUser = msg.sender === CURRENT_USER_ID;
                                            const canEdit = (new Date().getTime() - new Date(msg.timestamp).getTime()) < 60000;
                                            return (
                                            <div key={msg.id} className={cn("flex gap-3 group", isCurrentUser ? "justify-end" : "justify-start")}>
                                                 {!isCurrentUser && <Avatar className="h-8 w-8"><AvatarImage src={sender.avatar} alt={sender.name} data-ai-hint="user avatar" /><AvatarFallback>{sender.initials}</AvatarFallback></Avatar>}
                                                <div className="flex flex-col items-start gap-1">
                                                     {selectedConversation.type === 'group' && !isCurrentUser && (
                                                        <p className="text-xs text-muted-foreground ml-3">{sender.name}</p>
                                                    )}
                                                    <div className={cn("max-w-xs md:max-w-md p-3 rounded-2xl relative", isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card shadow-sm rounded-bl-none")}>
                                                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/@(\w+)/g, '<strong class="font-bold">@$1</strong>') }}></p>
                                                        <p className={cn("text-xs mt-1 text-right", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                         {isCurrentUser && (
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="absolute top-0 -left-10 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <MoreHorizontal className="h-4 w-4"/>
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-1">
                                                                    <div className="flex flex-col">
                                                                        <Button variant="ghost" size="sm" className="justify-start" disabled={!canEdit} onClick={() => handleEditMessage(msg)}>
                                                                            <Pencil className="mr-2 h-4 w-4"/> Edit
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm" className="justify-start text-destructive hover:text-destructive" onClick={() => handleDeleteMessage(msg.id)}>
                                                                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                                                                        </Button>
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}
                                                    </div>
                                                </div>
                                                 {isCurrentUser && <Avatar className="h-8 w-8"><AvatarImage src={users[CURRENT_USER_ID].avatar} alt={users[CURRENT_USER_ID].name} data-ai-hint="user avatar" /><AvatarFallback>{users[CURRENT_USER_ID].initials}</AvatarFallback></Avatar>}
                                            </div>
                                        )})}
                                    </div>
                                </ScrollArea>
                                <footer className="p-4 border-t">
                                     <form onSubmit={handleSendMessage}>
                                        <div className="relative">
                                            <Input placeholder="Type a message..." className="pr-20" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                         <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                                                            <AtSign className="h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-56 p-1">
                                                        <ScrollArea className="h-40">
                                                            {selectedConversation.participants.map(pId => {
                                                                const user = users[pId as keyof typeof users];
                                                                return (
                                                                     <Button key={user.id} variant="ghost" className="w-full justify-start" onClick={() => handleMention(user.name)}>
                                                                        <Avatar className="h-6 w-6 mr-2"><AvatarImage src={user.avatar}/><AvatarFallback>{user.initials}</AvatarFallback></Avatar>
                                                                        {user.name}
                                                                    </Button>
                                                                )
                                                            })}
                                                        </ScrollArea>
                                                    </PopoverContent>
                                                </Popover>
                                                <Button type="submit" size="icon" className="h-8 w-8">
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                     {editingMessage && (
                                        <div className="text-xs text-muted-foreground mt-2 flex justify-between items-center">
                                            <span>Editing message...</span>
                                            <Button variant="ghost" size="sm" onClick={() => { setEditingMessage(null); setNewMessage(""); }}>Cancel</Button>
                                        </div>
                                    )}
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
