
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Send } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  role: string;
}

interface NewMessageDialogProps {
  currentUser: User;
  allUsers: User[];
  onNewMessage: (conversation: any) => void;
}

export function NewMessageDialog({ currentUser, allUsers, onNewMessage }: NewMessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };
  
  const handleReset = () => {
    setSelectedUser(null);
    setMessage("");
    setSearchTerm("");
  }
  
  const handleSubmit = () => {
    if (!selectedUser || !message.trim()) return;

    const newConversation = {
      id: `conv${Date.now()}`,
      type: 'dm',
      participants: [currentUser.id, selectedUser.id],
      messages: [
        { 
            id: `msg${Date.now()}`,
            sender: currentUser.id, 
            text: message, 
            timestamp: new Date()
        },
      ],
      lastMessage: message,
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
      pinned: false,
    };
    
    onNewMessage(newConversation);
    setOpen(false);
    handleReset();
  };
  
  const filteredUsers = allUsers.filter(u => 
    u.id !== currentUser.id && 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleReset();
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            {selectedUser ? `Message to ${selectedUser.name}` : "Select a recipient to start a conversation."}
          </DialogDescription>
        </DialogHeader>
        
        {!selectedUser ? (
            <div className="space-y-4">
                <Input 
                    placeholder="Search for a user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ScrollArea className="h-64">
                    <div className="space-y-2">
                        {filteredUsers.map((user) => (
                             <button
                                key={user.id}
                                className="w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors hover:bg-muted"
                                onClick={() => handleSelectUser(user)}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                                    <AvatarFallback>{user.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        ) : (
             <div className="space-y-4">
                <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                />
            </div>
        )}
        
        <DialogFooter>
          {selectedUser && (
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Back
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={!selectedUser || !message.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
