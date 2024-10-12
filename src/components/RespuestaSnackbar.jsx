
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";

const RespuestaSnackbar = ({ response, onClose }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar
      open={response.status}
      autoHideDuration={6000} // Cambia la duración según tus necesidades
      onClose={handleClose}
    >
      <SnackbarContent message={response.msg} />
    </Snackbar>
  );
};

export default RespuestaSnackbar;