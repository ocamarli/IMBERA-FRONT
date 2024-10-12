import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Grid, TextField, Box, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import { usePlantillaService } from "../../../hooks/usePlantillaService";
import LoadingComponent from "../../LoadingComponent";
import { handleOnChangeInputTextoNumero } from "../../../utils";


const ModalAgregarNota = ({ idPlantilla,activo, onClose, auth, onResponse,setUltimaNota }) => {
  const {isLoading, handleAgregarNota} = usePlantillaService(onResponse);

  const { register, handleSubmit, formState: { errors } } = useForm();



  const onSubmit = async (data) => {

    const newData = {
      idPlantilla:idPlantilla,
      notas:{creadaPor: auth.correo,nota:data.notas},
      
    };
    
    //const response= await clonarPlantilla(newData)
    const response=await handleAgregarNota(newData)
    if(response)
    {
      setUltimaNota(data.notas)
      console.log("2222",data.notas)
    }
    console.log("33",newData)
   //setEstaActivoModalOk(true)
   //setRespuestaModalOk(response)
onClose()
  };

  const handleCerrarModal = () => {
    onClose()
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

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
          boxShadow: 20,
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          width:"35%",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} p={1} justifyContent="center">
            <Grid item xs={12}>

              <Typography variant="h5" component="div" fontWeight={600} sx={{ marginBottom: 2 }}>
                {"Agregar nota"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("notas", { required: true })}
                label="Nota"
                variant="outlined"
                fullWidth
                error={errors.notas ? true : false}
                helperText={errors.notas ? "Este campo es requerido" : ""}
                onChange={()=>handleOnChangeInputTextoNumero}
              />
            </Grid>
            <Grid item xs={6}>
              <Button type="submit" variant="contained" fullWidth sx={{ height: "50px" }}>
                Agregar
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button onClick={handleCerrarModal} variant="contained" sx={{ height: "50px" }} fullWidth color="error">
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalAgregarNota;