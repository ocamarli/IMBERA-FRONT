import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Grid, Paper, Typography, InputLabel } from "@mui/material";
import LoadingComponent from "../LoadingComponent";
import HeaderContent from "../HeaderContent";
import { useGaeService } from "../../hooks/useGaeServices";
import ListaGaes from './ListaGaes';
import ModalGenerico from "../../components/ModalGenerico";
import { handleOnChangeInputTextoNumero } from "../../utils.js";

const EditarGae = ({ idGae, setSelectedComponent, onResponse , auth}) => {
  const { handleEditarGae, gae, fetchGae, cerrarModalOk, estaActivoModalOk, respuestaModalOk } = useGaeService(onResponse);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    fetchGae(idGae);
  }, [fetchGae, idGae]);

  const onSubmit = (data) => handleEditarGae({ ...data, idGae });

  const handleOnCLickSalir = () => setSelectedComponent(<ListaGaes
    onResponse={onResponse}
   auth={auth}
   setSelectedComponent={setSelectedComponent} />);

  if (!gae) {
    return <LoadingComponent />;
  }

  const renderModal = () => (
    <ModalGenerico
      tipoModal={respuestaModalOk.status}
      open={estaActivoModalOk}
      onClose={cerrarModalOk}
      title={respuestaModalOk.status ? "Correcto" : "Advertencia"}
      message={respuestaModalOk.msg}
      autoCierre={true}
    />
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography>Id GAE</Typography>
          <TextField
            {...register("idGaeInterno")}
            fullWidth
            placeholder="Id Gae"
            variant="outlined"
            error={!!errors.idGaeInterno}
            helperText={errors.idGaeInterno && "Este campo es requerido"}
            onChange={handleOnChangeInputTextoNumero}
            defaultValue={gae.idGaeInterno}
            name="idGaeInterno"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Nombre GAE</Typography>
          <TextField
            {...register("nombre", { required: true })}
            fullWidth
            placeholder="Nombre Gae"
            variant="outlined"
            error={!!errors.nombre}
            helperText={errors.nombre && "Este campo es requerido"}
            onChange={handleOnChangeInputTextoNumero}
            defaultValue={gae.nombre}
            name="nombre"
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Código GAE</InputLabel>
          <TextField
            {...register("codigo")}
            fullWidth
            placeholder="Código"
            variant="outlined"
            error={!!errors.codigo}
            helperText={errors.codigo && "Este campo es requerido"}
            onChange={handleOnChangeInputTextoNumero}
            defaultValue={gae.codigo}
            name="codigo"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container sx={{ justifyContent: "space-around" }} spacing={2}>
            <Grid item xs={6}>
              <Button variant="contained" type="submit" sx={{ height: "50px" }} fullWidth>
                Actualizar
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button color="error" variant="contained" sx={{ height: "50px" }} fullWidth onClick={handleOnCLickSalir}>
                Salir
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <Grid container padding={2} justifyContent="center">
      {renderModal()}
      <Grid item xs={7}>
        <HeaderContent titulo="Editar GAE" />
        <Paper style={{ padding: 20 }}>
          {renderForm()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EditarGae;