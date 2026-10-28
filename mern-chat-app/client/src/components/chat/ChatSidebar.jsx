
import {
  Box,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import UserAvatar from "../common/UserAvatar";

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  search,
  onSearchChange,
}) {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h5" fontWeight={800} color="#635BFF">
          NIBZchat
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Your conversations
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{ mt: 2.5 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Divider />

      <List sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        {chats.map((chat) => (
          <ListItemButton
            key={chat.id}
            selected={activeChatId === chat.id}
            onClick={() => onSelectChat(chat.id)}
            sx={{
              borderRadius: 2.5,
              mb: 0.5,
              py: 1.5,
              "&.Mui-selected": { bgcolor: "#EEEDFF" },
              "&.Mui-selected:hover": { bgcolor: "#E5E3FF" },
            }}
          >
            <ListItemAvatar>
              <UserAvatar
                name={chat.name}
                color={chat.color}
                online={chat.online}
              />
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography fontWeight={600} noWrap>
                  {chat.name}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary" noWrap>
                  {chat.lastMessage}
                </Typography>
              }
            />

            {chat.unread > 0 && (
              <Box
                sx={{
                  bgcolor: "#635BFF",
                  color: "white",
                  borderRadius: "50%",
                  minWidth: 20,
                  height: 20,
                  px: 0.5,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                }}
              >
                {chat.unread}
              </Box>
            )}
          </ListItemButton>
        ))}

        {chats.length === 0 && (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            No conversations found.
          </Typography>
        )}
      </List>
    </Box>
  );
}
