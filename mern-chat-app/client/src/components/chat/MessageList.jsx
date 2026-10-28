
import { Box } from "@mui/material";
import MessageBubble from "./MessageBubble";
import EmptyState from "../common/EmptyState";

export default function MessageList({ messages = [] }) {
  if (!messages.length) {
    return (
      <EmptyState
        title="No messages yet"
        description="Send a message to start the conversation."
      />
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
      {messages.map((message) => (
        <MessageBubble key={message.id || message._id} message={message} />
      ))}
    </Box>
  );
}
