
import { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";

export default function MessageInput({ onSend, disabled = false }) {
  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = text.trim();

    if (!message || disabled) return;

    onSend(message);
    setText("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 1.5, sm: 2.5 },
        bgcolor: "#FFFFFF",
        borderTop: "1px solid #E8E8EF",
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto", display: "flex", gap: 1 }}>
        <IconButton aria-label="Add attachment" disabled>
          <AttachFileRoundedIcon />
        </IconButton>

        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          multiline
          maxRows={4}
          disabled={disabled}
          slotProps={{ htmlInput: { maxLength: 5000 } }}
        />

        <IconButton
          type="submit"
          aria-label="Send message"
          disabled={!text.trim() || disabled}
          sx={{
            bgcolor: "#635BFF",
            color: "white",
            "&:hover": { bgcolor: "#5148E5" },
            "&.Mui-disabled": { bgcolor: "#E8E8EF" },
          }}
        >
          <SendRoundedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
