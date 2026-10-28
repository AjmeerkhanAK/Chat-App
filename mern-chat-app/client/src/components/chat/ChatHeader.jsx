
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import UserAvatar from "../common/UserAvatar";

export default function ChatHeader({ chat, isMobile, onMenuClick }) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        color: "#252536",
        borderBottom: "1px solid #E8E8EF",
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        {isMobile && (
          <IconButton onClick={onMenuClick} aria-label="Open conversations">
            <MenuRoundedIcon />
          </IconButton>
        )}

        {chat && (
          <>
            <UserAvatar
              name={chat.name}
              color={chat.color}
              online={chat.online}
              size={42}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={700} noWrap>
                {chat.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {chat.online ? "Online" : "Offline"}
              </Typography>
            </Box>

            <IconButton aria-label="More chat options">
              <MoreVertRoundedIcon />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
