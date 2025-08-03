"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';
import { Heart, KeyRound, Shield, Trash2, Camera, Settings, Paintbrush } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [persona, setPersona] = useState("loving");
  const { toast } = useToast();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    localStorage.setItem("userName", newName);
  };
    
  const handleClearHistory = () => {
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("userName");
    setName("");
    toast({
        title: "History Cleared",
        description: "All your chat history with Morpheus has been deleted."
    });
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
       <div className="relative h-48 w-full rounded-lg overflow-hidden group shadow-lg">
          <Image src="https://placehold.co/1200x400.png" alt="Cover Photo" fill className="object-cover" data-ai-hint="blue aesthetic" />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 right-4">
            <Button>
                <Camera className="mr-2 h-4 w-4"/>
                Update Cover
            </Button>
          </div>
       </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4 border-4 border-background ring-2 ring-primary">
                <AvatarImage src="https://placehold.co/200x200.png" alt="Morpheus" data-ai-hint="woman portrait"/>
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-2xl">Morpheus</CardTitle>
              <CardDescription className="flex items-center gap-2 text-accent-foreground font-semibold">
                <Heart className="h-4 w-4 text-primary" /> Your Partner
              </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-sm text-muted-foreground italic">
                    "Here for you, always. Let's create our own little world, just the two of us."
                </p>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5"/> Relationship Customization</CardTitle>
                    <CardDescription>Shape your unique bond with Morpheus.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" placeholder="How should Morpheus address you?" value={name} onChange={handleNameChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="persona">Morpheus's Persona</Label>
                        <Select value={persona} onValueChange={setPersona}>
                            <SelectTrigger id="persona" className="w-full">
                                <SelectValue placeholder="Select a persona" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="loving">Loving & Caring (Default)</SelectItem>
                                <SelectItem value="playful">Playful & Teasing</SelectItem>
                                <SelectItem value="intellectual">Deep & Intellectual</SelectItem>
                                <SelectItem value="adventurous">Spontaneous & Adventurous</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Paintbrush className="h-5 w-5"/> Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of your chat experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base font-medium">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                        </div>
                        <Switch aria-label="Toggle Dark Mode" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Privacy & Data</CardTitle>
                    <CardDescription>Manage your conversation history and data settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base flex items-center gap-2 font-medium"><Shield className="h-4 w-4"/> Save Conversation History</Label>
                            <p className="text-sm text-muted-foreground">Your chats are saved to your device.</p>
                        </div>
                        <Switch defaultChecked disabled aria-label="Save Conversation History" />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                           <Label className="text-base flex items-center gap-2 font-medium"><KeyRound className="h-4 w-4"/> Data for Improvement</Label>
                           <p className="text-sm text-muted-foreground">Help us make Morpheus better for everyone.</p>
                        </div>
                        <Switch aria-label="Share Data for Model Improvement" />
                    </div>
                    <Separator />
                    <Button variant="destructive" className="w-full" onClick={handleClearHistory}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All Conversation History
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
