
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, LogOut, X, Users } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface User {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  role: string;
}

interface GroupInfoDialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  conversation: any;
  allUsers: User[];
  currentUser: User;
  onLeaveGroup: (convId: string) => void;
  onAddMembers: (convId: string, newUserIds: string[]) => void;
}

export function GroupInfoDialog({
  children,
  isOpen,
  onOpenChange,
  conversation,
  allUsers,
  currentUser,
  onLeaveGroup,
  onAddMembers
}: GroupInfoDialogProps) {
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const availableUsers = allUsers.filter(u =>
    !conversation.participants.includes(u.id) &&
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectUser = (user: User) => {
    setSelectedUsers(prev => 
      prev.find(u => u.id === user.id) 
      ? prev.filter(u => u.id !== user.id) 
      : [...prev, user]
    );
    setSearchTerm("");
  };
  
  const handleAddMembers = () => {
    if (selectedUsers.length === 0) return;
    onAddMembers(conversation.id, selectedUsers.map(u => u.id));
    setSelectedUsers([]);
    setIsAddingMembers(false);
  };
  
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
        setIsAddingMembers(false);
        setSelectedUsers([]);
        setSearchTerm('');
    }, 300);
  }

  const groupMembers = conversation.participants.map((id: string) => allUsers.find(u => u.id === id)).filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isAddingMembers ? "Add Members" : "Group Info"}</DialogTitle>
          {!isAddingMembers && <DialogDescription>{conversation.name}</DialogDescription>}
        </DialogHeader>

        {isAddingMembers ? (
          <div className="space-y-4">
            <Command className="rounded-lg border">
              <CommandInput 
                placeholder="Search for users to add..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                {availableUsers.length === 0 ? (
                    <CommandEmpty>No users found.</CommandEmpty>
                ) : (
                    <CommandGroup>
                      {availableUsers.map(user => (
                        <CommandItem key={user.id} onSelect={() => handleSelectUser(user)}>
                          <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                              {selectedUsers.find(u => u.id === user.id) && <span className="text-primary ml-auto">✓</span>}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                )}
              </CommandList>
            </Command>
             {selectedUsers.length > 0 && (
                 <div className="p-2 flex flex-wrap gap-1 border rounded-md">
                     {selectedUsers.map(user => (
                         <Badge key={user.id} variant="secondary" className="gap-1.5">
                             {user.name}
                             <button onClick={() => handleSelectUser(user)}>
                                <X className="h-3 w-3" />
                             </button>
                         </Badge>
                     ))}
                 </div>
             )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 p-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{groupMembers.length} Members</span>
            </div>
            <Separator />
            <ScrollArea className="max-h-60">
              <div className="space-y-2 p-2">
                {groupMembers.map((member: User) => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    {member.id === currentUser.id && <Badge variant="outline">You</Badge>}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
        
        <DialogFooter className="sm:justify-between gap-2">
          {isAddingMembers ? (
            <>
                <Button variant="ghost" onClick={() => setIsAddingMembers(false)}>Back</Button>
                <Button onClick={handleAddMembers} disabled={selectedUsers.length === 0}>
                    Add {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
                </Button>
            </>
          ) : (
            <>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">
                            <LogOut className="mr-2 h-4 w-4" />
                            Leave Group
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You will be removed from this group and will no longer receive messages.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onLeaveGroup(conversation.id)}>Leave</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                
                <Button onClick={() => setIsAddingMembers(true)} className="w-full sm:w-auto">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Members
                </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
