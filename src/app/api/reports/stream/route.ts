import { supabase } from '@/lib/supabase';

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const subscription = supabase
        .channel('attack_reports')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'attack_reports',
          },
          (payload) => {
            const data = encoder.encode(`data: ${JSON.stringify(payload.new)}\n\n`);
            controller.enqueue(data);
          }
        )
        .subscribe();

      // Keep the connection alive
      const interval = setInterval(() => {
        const data = encoder.encode(': keepalive\n\n');
        controller.enqueue(data);
      }, 30000);

      // Cleanup on close
      return () => {
        clearInterval(interval);
        subscription.unsubscribe();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 
