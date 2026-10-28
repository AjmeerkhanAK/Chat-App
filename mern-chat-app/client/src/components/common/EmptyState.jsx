
import { Box, Typography } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";

export default function EmptyState({
  title = "No conversation selected",
  description = "Choose a contact to start chatting.",
}) {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: 3,
        gap: 1,
      }}
    >
      <ChatBubbleOutlineRoundedIcon
        sx={{ fontSize: 56, color: "#635BFF", mb: 1 }}
      />
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Box>
  );
}
