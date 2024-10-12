import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Grid, Paper, Typography} from "@mui/material";
import LoadingComponent from "../LoadingComponent";
import HeaderContent from "../HeaderContent";
import { useFirmwareService } from "../../hooks/useFirmwareService";
import ListaFirmwares from '../Firmwares/ListaFirmwares';
import ModalGenerico from "../../components/ModalGenerico";
import { handleOnChangeInputTextoNumero, handleOnChangeInputIds } from "../../utils.js";

const EditarFirmware = ({ idFirmware, setSelectedComponent, onResponse ,auth}) => {
  const { handleEditarFirmware, firmware, fetchFirmware, cerrarModalOk, estaActivoModalOk, respuestaModalOk } = useFirmwareService(onResponse);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    fetchFirmware(idFirmware);
  }, [fetchFirmware, idFirmware]);

  const onSubmit = (data) => handleEditarFirmware({ ...data, idFirmware });

  const handleOnCLickSalir = () => setSelectedComponent(<ListaFirmwares
    onResponse={onResponse}
    auth={auth}
    setSelectedComponent={setSelectedComponent} />);

  if (!firmware) {
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
          <Typography>Id firmware</Typography>
          <TextField
            {...register("idFirmwareInterno")}
            fullWidth
            placeholder="Id Firmware"
            variant="outlined"
            error={!!errors.idFirmwareInterno}
            helperText={errors.idFirmwareInterno && "Este campo es requerido"}
            onChange={handleOnChangeInputIds}
            defaultValue={firmware.idFirmwareInterno}
            name="idFirmwareInterno"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Nombre firmware</Typography>
          <TextField
            {...register("nombre", { required: true })}
            fullWidth
            placeholder="Nombre Firmware"
            variant="outlined"
            error={!!errors.nombre}
            helperText={errors.nombre && "Este campo es requerido"}
            onChange={handleOnChangeInputTextoNumero}
            defaultValue={firmware.nombre}
            name="nombre"
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
        <HeaderContent titulo="Editar firmware" />
        <Paper style={{ padding: 20 }}>
          {renderForm()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EditarFirmware;