import React from "react";
import { Modal, Paper, TextField, Button, Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import "../ParametersCss.css";

const AddOptions = ({ open, handleClose}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {

    handleClose(data);
  };

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      slotProps={{ backdrop: { onClick: (e) => e.stopPropagation() } }}
      className={"ao-modal"}
    >
      <Paper
        elevation={3}
        sx={{
          minWidth: "calc(20vw)",
          padding: 2,
          height: "fit-content",
          maxWidth: "calc(20vw)",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 20 }}>Agregar opción</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("valor", { required: "Este campo es requerido" })}
                label="Valor"
                error={!!errors.valor}
                helperText={errors.valor ? errors.valor.message : ""}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("nombre", { required: "Este campo es requerido" })}
                label="Nombre"
                error={!!errors.nombre}
                helperText={errors.nombre ? errors.nombre.message : ""}
                variant="standard"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container sx={{ justifyContent: "flex-end" }} spacing={2}>
                <Grid item>
                  <Button variant="contained" type="submit">
                    Agregar
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                  color="error"
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClose();
                    }}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Modal>
  );
};

export default AddOptions;
