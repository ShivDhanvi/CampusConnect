
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
import { PlusCircle, Send, Users, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
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
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const availableUsers = allUsers.filter(u => u.id !== currentUser.id && u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectUser = (user: User) => {
    setSelectedUsers(prev => 
        prev.find(u => u.id === user.id) 
        ? prev.filter(u => u.id !== user.id) 
        : [...prev, user]
    );
    setSearchTerm("");
  };

  const handleReset = () => {
    setSelectedUsers([]);
    setMessage("");
    setGroupName("");
    setSearchTerm("");
  }
  
  const handleSubmit = () => {
    if (selectedUsers.length === 0 || !message.trim()) return;

    const isGroup = selectedUsers.length > 1;
    const participantIds = [currentUser.id, ...selectedUsers.map(u => u.id)];
    
    const newConversation = {
      id: `conv${Date.now()}`,
      type: isGroup ? 'group' : 'dm',
      name: isGroup ? (groupName.trim() || `Group with ${selectedUsers.map(u => u.name).join(', ')}`) : undefined,
      participants: participantIds,
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) handleReset();
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
            Select one or more recipients to start a conversation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0 px-6 space-y-4">
            <Command className="rounded-lg border">
                 <CommandInput 
                    placeholder="Type a name to search..." 
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                 />
                 <CommandList>
                    <ScrollArea className="h-[200px]">
                        <CommandEmpty>{availableUsers.length === 0 && searchTerm ? "No users found." : ""}</CommandEmpty>
                        <CommandGroup>
                            {availableUsers.filter(u => !selectedUsers.some(su => su.id === u.id)).map((user) => (
                            <CommandItem
                                key={user.id}
                                onSelect={() => handleSelectUser(user)}
                                className="flex items-center justify-between"
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

            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-1 p-2 border rounded-md">
                    {selectedUsers.map(user => (
                        <Badge key={user.id} variant="secondary" className="gap-1.5">
                            {user.name}
                            <button onClick={() => handleSelectUser(user)} className="ring-offset-background rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove {user.name}</span>
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {selectedUsers.length > 1 && (
                <div>
                     <Input
                        type="text"
                        placeholder="Group Name (optional)"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full"
                    />
                </div>
            )}
        </div>
        
        <div className="mt-auto px-6 pb-6 space-y-4">
            <div>
                <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                />
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={selectedUsers.length === 0 || !message.trim()}>
                {selectedUsers.length > 1 ? <Users className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                {selectedUsers.length > 1 ? 'Create Group & Send' : 'Send'}
            </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
