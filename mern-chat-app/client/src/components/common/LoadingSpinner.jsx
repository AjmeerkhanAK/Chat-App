
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={32} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
