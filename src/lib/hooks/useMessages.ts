import { useEffect, useState } from "react";
import type { Message } from "@/lib/types/message";

/**
 * Messages Hook 📬
 *
 * This hook acts as our message manager - it asks the server for messages,
 * keeps track of them, and lets components know if it's still working
 * or if something went wrong.
 *
 * The flow:
 * 1. Component needs messages
 * 2. Hook fetches them from server
 * 3. While waiting, tells component "loading = true"
 * 4. When done, hands over messages or explains what went wrong
 *
 * Usage:
 * const { messages, loading, error } = useMessages();
 */
export function useMessages() {
  // Three pieces of state our hook needs to track:
  const [messages, setMessages] = useState<Message[]>([]);     // The messages themselves
  const [loading, setLoading] = useState(true);               // Is the hook still fetching?
  const [error, setError] = useState<string | null>(null);    // Did something go wrong?

  // When a component first uses this hook:
  useEffect(() => {
    // This function talks to our server
    async function fetchMessages() {
      try {
        // First, ask the server for messages
        const response = await fetch("/api/messages");
        const data = await response.json();

        // Server either sends back messages or explains what went wrong
        if (data.success) {
          setMessages(data.data);  // Here are your messages!
        } else {
          setError(data.message);  // Something went wrong on the server
        }
      } catch (error) {
        // Or maybe we couldn't even reach the server
        setError("Failed to fetch messages");
      } finally {
        // Either way, we're done trying
        setLoading(false);
      }
    }

    // Start the fetch as soon as the component needs messages
    fetchMessages();
  }, []);  // Only fetch once when the component first appears

  // Hand over everything the component needs to work with messages
  return { messages, loading, error, setMessages };
}

/**
 * Future improvements:
 * - Fetch messages in smaller batches (pagination)
 * - Update messages in real-time when new ones arrive
 */
