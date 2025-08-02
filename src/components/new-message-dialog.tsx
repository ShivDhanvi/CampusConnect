
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Send } from "lucide-react";

interface User {
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
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");

  const availableUsers = Object.entries(allUsers)
    .filter(([id, user]) => user.name !== currentUser.name)
    .map(([id, user]) => ({ id, ...user }));

  const handleSubmit = () => {
    if (!selectedUser || !message) return;

    const newConversation = {
      id: `conv${Math.floor(Math.random() * 1000)}`,
      participants: ['admin', selectedUser],
      messages: [
        { sender: 'admin', text: message, timestamp: 'Just now' },
      ],
      lastMessage: message,
      lastMessageTime: 'Just now',
    };
    
    onNewMessage(newConversation);
    setOpen(false);
    setSelectedUser("");
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Select a user and type your message below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select a recipient" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">({user.role})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          <Button onClick={handleSubmit} disabled={!selectedUser || !message}>
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
