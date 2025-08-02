
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
import { PlusCircle, Send, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

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
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectUser = (user: User) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };
  
  const handleReset = () => {
    setSelectedUsers([]);
    setMessage("");
    setSearchTerm("");
    setGroupName("");
  }
  
  const handleSubmit = () => {
    if (selectedUsers.length === 0 || !message.trim()) return;

    let newConversation;
    if (selectedUsers.length === 1) {
        // Create a DM
        const selectedUser = selectedUsers[0];
        newConversation = {
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
    } else {
        // Create a group chat
        if (!groupName.trim()) {
            // Optionally, handle error for empty group name
            return;
        }
        newConversation = {
            id: `conv${Date.now()}`,
            name: groupName,
            type: 'group',
            participants: [currentUser.id, ...selectedUsers.map(u => u.id)],
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
        }
    }
    
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
      <DialogContent className="sm:max-w-lg flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
           <DialogDescription>
            Select recipients to start a conversation. Add multiple for a group chat.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 min-h-0 flex flex-col">
            <Input 
                placeholder="Search for a user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ScrollArea className="flex-grow border rounded-md">
                <div className="p-2 space-y-1">
                    {filteredUsers.map((user) => (
                         <button
                            key={user.id}
                            className={cn(
                                "w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors hover:bg-muted",
                                selectedUsers.find(u => u.id === user.id) && "bg-muted"
                            )}
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
        
        <DialogFooter className="!flex-col gap-4">
            {selectedUsers.length > 0 && (
                <div className="space-y-2">
                     <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium">To:</span>
                         {selectedUsers.map(user => (
                             <Badge key={user.id} variant="secondary" className="gap-1.5">
                                 {user.name}
                                 <button onClick={() => handleSelectUser(user)} className="rounded-full hover:bg-background/50">
                                    <X className="h-3 w-3" />
                                 </button>
                             </Badge>
                         ))}
                     </div>
                      {selectedUsers.length > 1 && (
                        <Input 
                            placeholder="Group Name..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    )}
                </div>
            )}
            <div className="relative">
                 <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="pr-12"
                />
                 <Button 
                    size="icon" 
                    className="absolute right-2 bottom-2 h-8 w-8"
                    onClick={handleSubmit} 
                    disabled={selectedUsers.length === 0 || !message.trim() || (selectedUsers.length > 1 && !groupName.trim())}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
