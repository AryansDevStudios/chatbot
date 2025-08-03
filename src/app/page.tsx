import ChatInterface from '@/components/chat-interface';

export default function Home() {
  return (
    <main className="flex h-[calc(100vh-3.5rem)] flex-col bg-background">
      <ChatInterface />
    </main>
  );
}
