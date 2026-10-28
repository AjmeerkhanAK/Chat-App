
import { Box, Typography } from "@mui/material";

export default function MessageBubble({ message }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: message.own ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: "85%", sm: "70%" },
          px: 2,
          py: 1.25,
          borderRadius: message.own
            ? "18px 18px 4px 18px"
            : "18px 18px 18px 4px",
          bgcolor: message.own ? "#635BFF" : "#FFFFFF",
          color: message.own ? "#FFFFFF" : "#252536",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflowWrap: "anywhere",
        }}
      >
        <Typography variant="body2">{message.text}</Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "right", mt: 0.5, opacity: 0.7 }}
        >
          {message.time || "Now"} {message.own ? "✓" : ""}
        </Typography>
      </Box>
    </Box>
  );
}
