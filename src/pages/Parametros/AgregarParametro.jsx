import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Grid, Paper, FormLabel, FormControl, InputLabel, MenuItem, FormHelperText, Select, RadioGroup, FormControlLabel, Radio, Dialog, IconButton } from '@mui/material';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HeaderContent from '../HeaderContent';
import ListaPlantillas from '../Plantillas/ListaPlatillas';
import ModalGenerico from '../../components/ModalGenerico';
import { useParametroService } from '../../hooks/useParametroService';
import LoadingComponent from '../LoadingComponent';
import AddOptions from './components/AddOptions';
import ItemOptions from './components/ItemOptions';
import { handleOnChangeInputTextoNumero, handleOnChangeInputTextoNumeroMinusculas } from '../../utils';

const AgregarParametro = ({ setSelectedComponent, onResponse, auth }) => {
  const {
    isLoading,
    estaActivoModalOk,
    respuestaModalOk,
    handleCrearParametro,
    cerrarModalOk
  } = useParametroService(onResponse);

  const [tipoCampo, setTipoCampo] = useState("");
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState([]);
  const [esValorFijo, setEsValorFijo] = useState("false");
  const { register, handleSubmit, formState: { errors }, setValue, setError, clearErrors } = useForm({ 
    defaultValues: {
      esValorFijo: "false",
      valorFijo: ""
    }
  });

  useEffect(() => {
    setValue("esValorFijo", esValorFijo);
  }, [esValorFijo, setValue]);

  const handleClickOpenOptions = () => {
    setOpenOptions(true);
  };

  const handleCloseOptions = (data) => {
    setOpenOptions(false);
    if (data) {
      setOptions((prevOptions) => [...prevOptions, data]);
      clearErrors("opciones");
    }
  };

  const removeOption = (value) => {
    setOptions((prevOptions) =>
      prevOptions.filter((option) => option.valor !== value)
    );
  };

  const onSubmit = (data) => {
    if (data.tipoCampo === "opciones" && options.length === 0) {
      setError("opciones", { type: "manual", message: "Debe agregar al menos una opción." });
      return;
    }
    
    let newData = "";

    data.esValorFijo = Boolean(data.esValorFijo);


    if (data.tipoCampo === "opciones") {
      const valores = options.map(item => item.valor);
      const formatoDeseado = `[${valores.join(',')}]`;
      newData = { ...data, opciones: options, rango: formatoDeseado, unidad: "N.A" };
    }

    if (data.tipoCampo === "rango") {
      const formatoDeseado = `[${data.valor_min},${data.valor_max}]`;
      newData = { ...data, rango: formatoDeseado };
    }

    handleCrearParametro(newData);
  };


  if (isLoading) {
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
        <Grid item xs={6}>
          <TextField
            {...register("idParametroInterno", { required: true })}
            fullWidth
            label="ID parámetro"
            variant="outlined"
            onChange={handleOnChangeInputTextoNumero}
            error={errors.idParametroInterno ? true : false}
            helperText={
              errors.idParametroInterno ? "Este campo es requerido" : ""
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...register("descripcion", { required: true })}
            fullWidth
            label="Descripción"
            variant="outlined"
            onChange={handleOnChangeInputTextoNumeroMinusculas}
            error={errors.descripcion ? true : false}
            helperText={errors.descripcion ? "Este campo es requerido" : ""}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel>Tipo parámetro</InputLabel>
            <Select
              {...register("tipoParametro", { required: true })}
              onChange={(e) => {
                setValue("tipoParametro", e.target.value);
              }}
              label="tipo parámetro"
              error={errors.tipoParametro ? true : false}
            >
              <MenuItem value="">
                <em>Tipo parámetro</em>
              </MenuItem>
              <MenuItem value={"general"}>General</MenuItem>
              <MenuItem value={"programacion"}>Programación</MenuItem>
            </Select>
            {errors.tipoParametro && (
              <FormHelperText error={true}>
                Este campo es requerido.
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" sx={{ width: "100%" }}>
            <InputLabel>Grupo</InputLabel>
            <Select
              {...register("grupo", { required: true })}
              onChange={(e) => {
                setValue("grupo", e.target.value);
              }}
              label="grupo"
              error={errors.grupo ? true : false}
            >
              <MenuItem value="">
                <em>Grupo</em>
              </MenuItem>
              <MenuItem value={"Temperatura"}>Temperatura</MenuItem>
              <MenuItem value={"Deshielo"}>Deshielo</MenuItem>
              <MenuItem value={"Display"}>Display</MenuItem>
              <MenuItem value={"Equipo"}>Equipo</MenuItem>
              <MenuItem value={"Fabricante"}>Fabricante</MenuItem>
              <MenuItem value={"Cliente"}>Cliente</MenuItem>
              <MenuItem value={"Consumo"}>Consumo</MenuItem>
              <MenuItem value={"Alarmas"}>Alarmas</MenuItem>
              <MenuItem value={"Otros Tiempo"}>Otros tiempos</MenuItem>
              <MenuItem value={"Temperatura programa"}>
                Temperatura programa
              </MenuItem>
              <MenuItem value={"Deshielo programa"}>Deshielo programa</MenuItem>
              <MenuItem value={"Alarma programa"}>Alarma programa</MenuItem>
            </Select>
            {errors.grupo && (
              <FormHelperText error={true}>
                Este campo es requerido.
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" sx={{ width: "100%" }}>
            <InputLabel>Tipo de campo</InputLabel>
            <Select
              {...register("tipoCampo", { required: true })}
              onChange={(e) => {
                setValue("tipoCampo", e.target.value);
                setTipoCampo(e.target.value);
              }}
              label="Tipo de campo"
              error={errors.tipoCampo ? true : false}
            >
              <MenuItem value="">
                <em>Tipo de campo</em>
              </MenuItem>
              <MenuItem value={"rango"}>Rango</MenuItem>
              <MenuItem value={"opciones"}>Opciones</MenuItem>
            </Select>
            {errors.tipoCampo && (
              <FormHelperText error={true}>
                Este campo es requerido.
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}></Grid>
        {tipoCampo === "rango" ? (
          <Grid item xs={6} name="gridRango">
            <Paper variant="standard" style={{ padding: 15 }}>
              <Grid container direction="column">
                <Grid item>
                  <FormLabel style={{ marginBottom: 5 }}>Rango</FormLabel>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" sx={{ width: "200px" }}>
                    <InputLabel>Unidad</InputLabel>
                    <Select
                      {...register("unidad", { required: true })}
                      onChange={(e) => {
                        setValue("unidad", e.target.value);
                      }}
                      error={errors.unidad ? true : false}
                    >
                      <MenuItem value="">
                        <em>Unidad</em>
                      </MenuItem>
                      <MenuItem value={"h"}>Horas</MenuItem>
                      <MenuItem value={"min"}>Minutos</MenuItem>
                      <MenuItem value={"seg"}>Segundos</MenuItem>
                      <MenuItem value={"°C"}>Centigrados</MenuItem>
                    </Select>
                    {errors.unidad && (
                      <FormHelperText error={true}>
                        Este campo es requerido.
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item >
                  <TextField
                    {...register("valor_min", { required: true })}
                    label="Valor mínimo"
                    variant="standard"
                    error={errors.valor_min ? true : false}
                    helperText={
                      errors.valor_min ? "Este campo es requerido" : ""
                    }
                    sx={{ width: "200px" }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    {...register("valor_max", { required: true })}
                    label="Valor máximo"
                    variant="standard"
                    error={errors.valor_max ? true : false}
                    helperText={
                      errors.valor_max ? "Este campo es requerido" : ""
                    }
                    sx={{ width: "200px" }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ) : tipoCampo === "opciones" ? (
          <Grid item xs={6} name="gridOptions">
            <Paper variant="outlined" style={{ padding: 15 }}>
              <FormLabel>
                Agregar opción:
                <IconButton
                  aria-label="Agregar parametro"
                  onClick={handleClickOpenOptions}
                >
                  <AddCircleIcon />
                </IconButton>
              </FormLabel>
              <Grid
                item
                xs={12}
                sx={{
                  overflowY: "scroll",
                  maxHeight: "250px",
                  height: "fit-content",
                }}
              >
                {options.map((item, index) => (
                  <ItemOptions
                    key={index}
                    value={item.valor}
                    name={item.nombre}
                    removeOption={removeOption}
                  ></ItemOptions>
                ))}
              </Grid>
            </Paper>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">¿Es un valor fijo?</FormLabel>
            <RadioGroup
              {...register("esValorFijo")}
              value={esValorFijo}
              onChange={(e) => {
                setEsValorFijo(e.target.value);
                if (e.target.value === "true") {
                  setValue("valorFijo", "", { shouldValidate: true });
                } else {
                  setValue("valorFijo", "");
                }
              }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Sí" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
            {errors.esValorFijo && (
              <FormHelperText error={true}>
                Este campo es requerido.
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {esValorFijo === "true" && (
          <Grid item xs={6}>
            <TextField
              {...register("valorFijo", {
                required: esValorFijo === "true",
              })}
              fullWidth
              label="Valor Fijo"
              variant="standard"
              error={errors.valorFijo ? true : false}
              helperText={errors.valorFijo ? "Este campo es requerido" : ""}
            />
          </Grid>
        )}
       <Grid item xs={12}>
          <Dialog open={openOptions} onClose={() => handleCloseOptions(null)}>
            <AddOptions
              open={openOptions}
              handleClose={handleCloseOptions}
            />
          </Dialog>
        </Grid>
        {errors.opciones && (
          <Grid item xs={12}>
            <FormHelperText error={true}>
              {errors.opciones.message}
            </FormHelperText>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container sx={{ justifyContent: "flex-end" }} spacing={2}>
            <Grid item xs={6}>
              <Button variant="contained" type="submit" sx={{ height: "50px" }} fullWidth>
                Agregar
              </Button>
            </Grid>
            <Grid item xs={6}>
            <Button
                      color="error"
                      variant="contained"
                      sx={{ height: "50px" }}
                      fullWidth
                      onClick={() => setSelectedComponent(        <ListaPlantillas
                        onResponse={onResponse}
                        auth={auth}
                        setSelectedComponent={setSelectedComponent}
                      ></ListaPlantillas>)}
                    >
                      Salir
                    </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <Grid container padding={2} justifyContent={"center"}>
      {renderModal()}
      <Grid item xs={12}>
        <HeaderContent titulo="Agregar parámetro" />
        <Paper style={{ padding: 20 }}>
          {renderForm()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AgregarParametro;