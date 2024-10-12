import { Typography, Button, Grid, TextField, Box, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import { usePlantillaService } from "../../../hooks/usePlantillaService";
import LoadingComponent from "../../LoadingComponent";
import { handleOnChangeInputTextoNumero } from "../../../utils";
const ModalClonarPlantilla = ({
  activo,
  onClose,
  auth,
  onResponse,
  plantillaAClonar,
  setEstaActivoModalOk,
  setRespuestaModalOk,
  setClonacionExitosa
}) => {
  const { isLoading, clonarPlantilla } = usePlantillaService(onResponse);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  const onSubmit = async (data) => {
    const newData = {
      ...data,
      idPlantilla: plantillaAClonar.idPlantilla,
      creadoPor: auth.correo,
    };
    const response = await clonarPlantilla(newData);
    console.log("response23",response)


    if (response.status) {
        setEstaActivoModalOk(true);
        setRespuestaModalOk(response);
        setClonacionExitosa(true)
    
    }
    handleCerrarModal();
  };

  const handleCerrarModal = () => {

    if (onClose) onClose();
    reset();
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <Modal
      open={activo}
      onClose={handleCerrarModal}
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
          width: "20%",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} p={1} justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                Colocar nombre a plantilla a generar
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ marginBottom: 2 }}
              >
                {`Platilla a clonar (${plantillaAClonar.nombrePlantilla})`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("idPlantillaInterno", { required: true })}
                label="ID de la nueva plantilla"
                variant="outlined"
                fullWidth
                error={!!errors.idPlantillaInterno}
                helperText={
                  errors.idPlantillaInterno ? "Este campo es requerido" : ""
                }
                onChange={handleOnChangeInputTextoNumero}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("nombrePlantilla", { required: true })}
                label="Nombre de la nueva plantilla"
                variant="outlined"
                fullWidth
                error={!!errors.nombrePlantilla}
                helperText={
                  errors.nombrePlantilla ? "Este campo es requerido" : ""
                }
                onChange={handleOnChangeInputTextoNumero}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth sx={{ height: "50px" }}>
                Clonar
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleCerrarModal}
                variant="contained"
                sx={{ height: "50px" }}
                fullWidth
                color="error"
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalClonarPlantilla;
