
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Send, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

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

  const handleSelectUser = (userName: string) => {
    const user = allUsers.find(u => u.name === userName);
    if(user) {
        setSelectedUser(user);
    }
    setSearchTerm("");
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
  
  const unselectedUsers = allUsers.filter(u => u.id !== currentUser.id && u.id !== selectedUser?.id);

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
      <DialogContent className="sm:max-w-lg p-0 flex flex-col h-[600px]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Select a recipient to start a conversation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0 px-6 pt-4 space-y-4">
            {!selectedUser ? (
                <Command className="rounded-lg border">
                    <CommandInput 
                        placeholder="Type a name to search..." 
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandList>
                        <ScrollArea className="h-[350px]">
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup>
                                {unselectedUsers
                                .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((user) => (
                                <CommandItem
                                    key={user.id}
                                    value={user.name}
                                    onSelect={handleSelectUser}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                                            <AvatarFallback>{user.initials}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                        <span className="text-xs text-muted-foreground">({user.role})</span>
                                    </div>
                                </CommandItem>
                                ))}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            ) : (
                 <div className="flex flex-wrap gap-1 p-2 border rounded-md">
                     <Badge variant="secondary" className="gap-1.5">
                         {selectedUser.name}
                         <button onClick={() => setSelectedUser(null)} className="ring-offset-background rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                             <X className="h-3 w-3" />
                             <span className="sr-only">Remove {selectedUser.name}</span>
                         </button>
                     </Badge>
                </div>
            )}
        </div>
        
        <div className="mt-auto px-6 pb-6 space-y-4">
            <div className="mt-4">
                <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                />
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedUser || !message.trim()}>
                <Send className="mr-2 h-4 w-4" />
                Send
            </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
