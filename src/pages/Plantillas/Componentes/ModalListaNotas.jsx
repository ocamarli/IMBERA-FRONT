import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Grid, Box, Modal, List, ListItem, ListItemText } from "@mui/material";
import { formatearFecha } from "../../../utils";
const ModalListaNotas = ({ notas, open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          width: "35%",
          maxHeight:"80%"
        }}
        
      >
                    <Typography
                      component="span"
                      variant="h6"
                      color="text.primary"
                    >
                      NOTAS
                    </Typography>      
        <List sx={{ overflowY: "auto" }}>
          {notas.slice().reverse().map((nota, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {index + 1}. {nota.nota}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {formatearFecha(nota.fechaCreada)}
                    </Typography>
                    {" — "}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {nota.creadaPor}
                    </Typography>
                  </>
                }
              />
            </ListItem>
           
          )) }
        </List>
        <Grid item xs={12}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ height: "50px" }}
            fullWidth

          >
          Salir
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ModalListaNotas;
