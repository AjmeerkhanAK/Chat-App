
import { Avatar, Badge } from "@mui/material";

export default function UserAvatar({
  name = "User",
  color = "#635BFF",
  online = false,
  size = 44,
}) {
  return (
    <Badge
      overlap="circular"
      variant="dot"
      invisible={!online}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: "#22C55E",
          boxShadow: "0 0 0 2px white",
          width: 10,
          height: 10,
          borderRadius: "50%",
        },
      }}
    >
      <Avatar
        sx={{
          width: size,
          height: size,
          bgcolor: color,
          fontWeight: 600,
        }}
      >
        {name.charAt(0).toUpperCase()}
      </Avatar>
    </Badge>
  );
}
