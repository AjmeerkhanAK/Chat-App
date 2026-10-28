import { socket } from "../services/socket";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import EmptyState from "../components/common/EmptyState";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logout } from "../features/auth/authSlice";
import {
   fetchChats,
  setActiveChat,
  setSearch,
  updateLastMessage,
} from "../features/chats/chatSlice";
import { addMessage,  fetchMessages,
  sendMessage, } from "../features/messages/messageSlice";

const DRAWER_WIDTH = 320;

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);


const {
  chats: rawChats = [],
  activeChatId,
  search = "",
  loading,
  error,
} = useAppSelector((state) => state.chats);

const messagesByChatId = useAppSelector(
  (state) => state.messages.byChatId ?? {}
);

const currentUser = useAppSelector((state) => state.auth.user);

const currentUserId = String(
  currentUser?._id ?? currentUser?.id ?? ""
);

useEffect(() => {
  const handleNewMessage = (message) => {
    const conversationId = String(
      message.conversation?._id ??
      message.conversation ??
      message.conversationId ??
      ""
    );

    if (!conversationId || !message._id) return;

    dispatch(
      addMessage({
        conversationId,
        message,
      })
    );

    dispatch(
      updateLastMessage({
        chatId: conversationId,
        message,
      })
    );
  };

  socket.on("new_message", handleNewMessage);

  return () => {
    socket.off("new_message", handleNewMessage);
  };
}, [dispatch]);

useEffect(() => {
  const token = localStorage.getItem("chat_token");

  if (!token || !currentUser) {
    socket.disconnect();
    return;
  }

  socket.auth = { token };

  const handleConnect = () => {
    if (activeChatId) {
      socket.emit("join_conversation", activeChatId);
    }
  };

  socket.on("connect", handleConnect);
  socket.connect();

  return () => {
    socket.off("connect", handleConnect);
    socket.disconnect();
  };
}, [currentUser, activeChatId]);

// Convert MongoDB conversations into the shape your existing UI expects.
const chats = useMemo(
  () =>
    rawChats.map((chat) => {
      const otherUser = (chat.participants ?? []).find(
        (participant) =>
          String(participant._id ?? participant.id) !== currentUserId
      );

      return {
        ...chat,
        id: chat._id ?? chat.id,
        name: chat.isGroup
          ? chat.groupName || "Group chat"
          : otherUser?.name || "Conversation",
        avatar: otherUser?.avatar || "",
        isOnline: otherUser?.isOnline ?? false,
      };
    }),
  [rawChats, currentUserId]
);

const activeChat =
  chats.find((chat) => chat.id === activeChatId) ?? null;

useEffect(() => {
  dispatch(fetchChats());
}, [dispatch]);

useEffect(() => {
  if (activeChatId) {
    dispatch(fetchMessages(activeChatId));
  }
}, [dispatch, activeChatId]);

const filteredChats = useMemo(() => {
  const query = search.trim().toLowerCase();

  return chats.filter((chat) =>
    (chat.name ?? "").toLowerCase().includes(query)
  );
}, [chats, search]);

const rawMessages = activeChat
  ? messagesByChatId[activeChat.id] ?? []
  : [];

const messages = rawMessages.map((message) => ({
  ...message,
  id: message._id ?? message.id,
  own:
    String(message.sender?._id ?? message.sender?.id ?? message.sender) ===
    currentUserId,
  time: message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "",
}));


  const handleSelectChat = (chatId) => {
    dispatch(setActiveChat(chatId));
    setMobileDrawerOpen(false);
  };

const handleSendMessage = async (text) => {
  if (!activeChat || !text.trim()) return;

  const result = await dispatch(
    sendMessage({
      conversationId: activeChat.id,
      text: text.trim(),
    })
  );

  if (sendMessage.fulfilled.match(result)) {
    dispatch(
      updateLastMessage({
        chatId: activeChat.id,
        message: result.payload.message,
      })
    );
  }
};

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const sidebar = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ChatSidebar
          chats={filteredChats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          search={search}
          onSearchChange={(value) => dispatch(setSearch(value))}
        />
      </Box>

      <Box
        sx={{
          borderTop: "1px solid #E8E8EF",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          NIBZchat
        </Typography>
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout} aria-label="Logout">
            <LogoutRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        bgcolor: "#F5F6FA",
        overflow: "hidden",
      }}
    >
      {isMobile ? (
        <Drawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          PaperProps={{
            sx: { width: DRAWER_WIDTH, maxWidth: "85vw" },
          }}
        >
          {sidebar}
        </Drawer>
      ) : (
        <Box
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            bgcolor: "#FFFFFF",
            borderRight: "1px solid #E8E8EF",
          }}
        >
          {sidebar}
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatHeader
          chat={activeChat}
          isMobile={isMobile}
          onMenuClick={() => setMobileDrawerOpen(true)}
        />

        {activeChat ? (
          <>
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <MessageList messages={messages} />        
            </Box>

            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <Box sx={{ flex: 1 }}>
            <EmptyState
              title="Select a conversation"
              description="Choose a contact from the sidebar to start chatting."
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
