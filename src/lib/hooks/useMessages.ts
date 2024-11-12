import { useEffect, useState } from "react";
import type { Message } from "@/lib/types/message";

/**
 * Messages Hook
 *
 * Why this exists:
 * ---------------
 * Provides a centralized way to fetch and manage messages. Currently handles
 * one-way messages (student -> tutor) but could be expanded for chat features.
 *
 * Input/Output:
 * ------------
 * IN  -> none (auto-fetches on mount)
 * OUT -> {
 *   messages: Message[],
 *   loading: boolean,
 *   error: string | null,
 *   setMessages: (m: Message[]) => void
 * }
 *
 * !IMPORTANT: Only fetches once on mount - requires page refresh for updates
 */
export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches messages from API
   * !IMPORTANT: No dependencies means one-time fetch
   */
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch("/api/messages");
        const data = await response.json();

        if (data.success) {
          setMessages(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  return { messages, loading, error, setMessages };
}

// TODO: Add pagination for large message lists or something
// TODO: Consider WebSocket/polling for real-time updates (We still need to learn how to implement this)
