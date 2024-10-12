import React, { useEffect } from "react";
import { Modal, Box, Typography, Button, Grid } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ModalGenerico = ({ open, onClose, title, message, actions, autoCierre, tipoModal ,msActiva=2200}) => {
  useEffect(() => {
    if (open && autoCierre) {
      const timer = setTimeout(() => {
        onClose();
      }, msActiva);
      return () => clearTimeout(timer);
    }
  }, [open, autoCierre, onClose,msActiva]);
  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    onClose();
  };

  const iconoModal = () => {
    switch (tipoModal) {
      case true:
        return <CheckCircleOutlineIcon sx={{ color: "green", mb: 2 }} fontSize="large" />;
      case false:
        return <ErrorOutlineIcon sx={{ color: "red", mb: 2 }} fontSize="large" />;
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {iconoModal()}
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>
        {actions && (
          <Grid container spacing={1}>
            {actions.map((action, index) => (
              <Grid item xs={6} key={index}>
                <Button
                  onClick={action.handler}
                  variant="contained"
                  color={action.color || "primary"}
                  sx={{ width: "100%" }}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export default ModalGenerico;
