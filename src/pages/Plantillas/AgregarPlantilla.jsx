import { useForm, Controller } from "react-hook-form";
import React, { useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  Grid,
  Paper,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

import HeaderContent from "../HeaderContent";
import { handleOnChangeInputIdPlantilla, handleOnChangeInputTextoNumero } from "../../utils.js";
import ListaParametros from "../Parametros/ListaParametros.jsx";
import { usePlantillaService } from "../../hooks/usePlantillaService.jsx";
import { useParametroService } from "../../hooks/useParametroService.jsx";
import { useHardwareService } from "../../hooks/useHardwareService.jsx";
import { useFirmwareService } from "../../hooks/useFirmwareService.jsx";
import { useGaeService } from "../../hooks/useGaeServices.jsx";
import ModalGenerico from "../../components/ModalGenerico.jsx";
import LoadingComponent from "../LoadingComponent.jsx";


const AgregarPlantilla = ({ setSelectedComponent, onResponse, auth }) => {
  const {
    isLoading,
    handleCrearPlantilla,
    cerrarModalOk,
    estaActivoModalOk,
    respuestaModalOk,

  } = usePlantillaService();
  const { parametros, fetchParametros } = useParametroService(onResponse);
  const { hardwares, fetchHardwares } = useHardwareService(onResponse);
  const { firmwares, fetchFirmwares } = useFirmwareService(onResponse);
  const { gaes, fetchGaes } = useGaeService(onResponse);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchParametros();
    fetchHardwares(true);
    fetchFirmwares(true);
    fetchGaes(true);
  }, [fetchParametros, fetchHardwares, fetchFirmwares, fetchGaes]);

  const onSubmit = (data) => {
    console.log("onsub");
    console.log(data);
    if (handleCrearPlantilla(data, parametros, auth)) {
      console.log(true);
    } else {
      console.log(false);
    }
  };

  useEffect(() => {
    console.log("Firmwares:", firmwares);
    console.log("Hardwares:", hardwares);
  }, [firmwares, hardwares]);

  const renderModals = () => (
    <>
      <ModalGenerico
        tipoModal={respuestaModalOk.status}
        open={estaActivoModalOk}
        onClose={cerrarModalOk}
        title={respuestaModalOk.status ? "Correcto" : "Advertencia"}
        message={respuestaModalOk.msg}
        autoCierre={true}
      />
 
    </>
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Grid container padding={2} justifyContent={"center"}>
      <Grid item xs={12}>
        {renderModals()}
        <HeaderContent titulo={"Agregar plantilla"}></HeaderContent>
        <Paper style={{ padding: 20 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography>Id de plantilla</Typography>
                <TextField
                  // Asegúrate de pasar la función aquí
                  {...register("idPlantillaInterno", { required: true })}
                  size="small"
                  fullWidth
                  placeholder="Id plantilla"
                  variant="outlined"
                  error={errors.idPlantillaInterno}
                  helperText={errors.idPlantillaInterno && "Este campo es requerido"}
                  onChange={handleOnChangeInputIdPlantilla} 
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Nombre de plantilla</Typography>
                <TextField
                  {...register("nombrePlantilla", { required: true })}
                  size="small"
                  fullWidth
                  placeholder="Nombre plantilla"
                  variant="outlined"
                  error={errors.nombrePlantilla ? true : false}
                  helperText={
                    errors.nombrePlantilla ? "Este campo es requerido" : ""
                  }
                  onChange={handleOnChangeInputTextoNumero} 
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Firmware</Typography>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                  <Controller
                    name="firmware"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="small"
                        error={errors.firmware ? true : false}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return <em>Selecciona una firmware</em>;
                          }
                          return selected;
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Selecciona una firmware</em>
                        </MenuItem>
                        {firmwares.map((firmware, index) => (
                          <MenuItem
                            key={index}
                            value={firmware.idFirmwareInterno}
                          >
                            {firmware.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography>Hardware</Typography>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                  <Controller
                    name="hardware"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="small"
                        error={errors.hardware ? true : false}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return <em>Selecciona una hardware</em>;
                          }
                          return selected;
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Selecciona una hardware</em>
                        </MenuItem>
                        {hardwares.map((hardware, index) => (
                          <MenuItem
                            key={index}
                            value={hardware.idHardwareInterno}
                          >
                            {hardware.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography>GAE</Typography>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                  <Controller
                    name="gae"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="small"
                        error={errors.gae ? true : false}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return <em>Selecciona una gae</em>;
                          }
                          return selected;
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Selecciona una gae</em>
                        </MenuItem>
                        {gaes.map((gae, index) => (
                          <MenuItem key={index} value={gae.idGaeInterno}>
                            {gae.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography>Nota</Typography>
                <TextField
                  {...register("notas", { required: true })}
                  size="small"
                  fullWidth
                  placeholder="Nota"
                  variant="outlined"
                  error={errors.notas ? true : false}
                  helperText={
                    errors.notas ? "Este campo es requerido" : ""
                  }
                  onChange={handleOnChangeInputTextoNumero}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  sx={{ justifyContent: "space-around" }}
                  spacing={2}
                >
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{ height: "50px" }}
                      fullWidth
                    >
                      AGREGAR
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      color="error"
                      variant="contained"
                      sx={{ height: "50px" }}
                      fullWidth
                      onClick={() => setSelectedComponent(        <ListaParametros
                        onResponse={onResponse}
                        auth={auth}
                        setSelectedComponent={setSelectedComponent}
                      ></ListaParametros>)}
                    >
                      Salir
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AgregarPlantilla;
