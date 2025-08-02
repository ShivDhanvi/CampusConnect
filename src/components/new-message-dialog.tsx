
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

interface User {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  role: string;
}

interface NewMessageDialogProps {
  currentUser: User;
  allUsers: Record<string, User>;
  onNewMessage: (conversation: any) => void;
}

export function NewMessageDialog({ currentUser, allUsers, onNewMessage }: NewMessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [groupName, setGroupName] = useState("");

  const availableUsers = Object.values(allUsers).filter(u => u.id !== currentUser.id);

  const handleSelectUser = (user: User) => {
    setSelectedUsers(prev => 
        prev.find(u => u.id === user.id) 
        ? prev.filter(u => u.id !== user.id) 
        : [...prev, user]
    );
  };
  
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
    setSelectedUsers([]);
    setMessage("");
    setGroupName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Select recipients and compose your message.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
            <Command className="rounded-lg border">
                 <CommandInput placeholder="Type a name to search..." />
                 {selectedUsers.length > 0 && (
                     <div className="p-2 flex flex-wrap gap-1">
                         {selectedUsers.map(user => (
                             <Badge key={user.id} variant="secondary" className="gap-1">
                                 {user.name}
                                 <button onClick={() => handleSelectUser(user)}>
                                    <X className="h-3 w-3" />
                                 </button>
                             </Badge>
                         ))}
                     </div>
                 )}
                 <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                        {availableUsers.map((user) => (
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
                            {selectedUsers.find(u => u.id === user.id) && <span className="text-primary">✓</span>}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                 </CommandList>
            </Command>

            {selectedUsers.length > 1 && (
                <div>
                     <input
                        type="text"
                        placeholder="Group Name (optional)"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
            )}
          
          <div>
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>
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
      </DialogContent>
    </Dialog>
  );
}
