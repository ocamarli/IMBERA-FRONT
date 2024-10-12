import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Paper, FormLabel, FormControl, InputLabel, MenuItem, Select, RadioGroup, FormControlLabel, Radio, Dialog, IconButton } from '@mui/material';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HeaderContent from '../HeaderContent';
import Home from '../Home/Home';
import ModalGenerico from '../../components/ModalGenerico';
import { useParametroService } from '../../hooks/useParametroService';
import LoadingComponent from '../LoadingComponent';
import AddOptions from './components/AddOptions';
import ItemOptions from './components/ItemOptions';
import { useForm } from 'react-hook-form';

const EditarParametro = ({ setSelectedComponent, onResponse, idParametro }) => {
  const {
    isLoading,
    estaActivoModalOk,
    respuestaModalOk,
    handleEditarParametro,
    cerrarModalOk,
    fetchParametro,
    parametro,
    openOptions,
    options,
    setOpenOptions,
    setOptions,
  } = useParametroService(onResponse);

  const { register, handleSubmit, setError, formState: { errors }, clearErrors } = useForm();

  const [tipoCampo, setTipoCampo] = useState("");
  const [esValorFijo, setEsValorFijo] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [tipoParametro, setTipoParametro] = useState("");
  const [grupo, setGrupo] = useState("");
  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");
  const [valorFijo, setValorFijo] = useState("");
  const [unidad, setUnidad] = useState("");

  useEffect(() => {
    fetchParametro(idParametro);
  }, [fetchParametro, idParametro]);

  useEffect(() => {
    if (parametro) {
      console.log("parametro",parametro)
      setDescripcion(parametro.descripcion || "");
      setTipoParametro(parametro.tipoParametro || "");
      setGrupo(parametro.grupo || "");
      setTipoCampo(parametro.tipoCampo || "");
      setEsValorFijo(parametro.esValorFijo || false);
      setValorMinimo(parametro.valor_min || "");
      setValorMaximo(parametro.valor_max || "");
      setValorFijo(parametro.valorFijo || "");
      setOptions(parametro.opciones || []);
      setUnidad(parametro.unidad || "")
    }
  }, [parametro,setOptions]);

  const handleClickOpenOptions = () => {
    setOpenOptions(true);
  };

  const handleCloseOptions = (data) => {
    if (data) {
      setOptions((prevOptions) => [...prevOptions, data]);
      clearErrors("opciones");
    }
    setOpenOptions(false);
  };

  const removeOption = (value) => {
    setOptions((prevOptions) => prevOptions.filter((option) => option.valor !== value));
  };

  const onSubmit = (data) => {
    console.log("on....", data)
    if (tipoCampo === "opciones" && options.length === 0) {
      setError("opciones", { type: "manual", message: "Debe agregar al menos una opción." });
      return;
    }

    if (tipoCampo==="opciones"){
      data.opciones=options
    }
    if (tipoCampo==="rango"){
      data.valor_min=valorMinimo
      data.valor_max=valorMaximo
    }    
    const newData = {
      ...data,
      idParametro:idParametro,
      tipoParametro:tipoParametro,
      grupo:grupo,
      tipoCampo:tipoCampo,
      esValorFijo:esValorFijo,
      valorFijo:valorFijo,
    };
    console.log("newData",newData)
    handleEditarParametro(newData);
  };

  const handleOnCLickSalir = () => setSelectedComponent(<Home />);

  if (isLoading || !parametro) {
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
            disabled
            fullWidth
            label="ID parámetro"
            variant="outlined"
            defaultValue={parametro.idParametroInterno || ""}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...register("descripcion", { required: true })}
            fullWidth
            label="Descripción"
            variant="outlined"
            error={errors.descripcion ? true : false}
            helperText={errors.descripcion ? "Este campo es requerido" : ""}
            value={descripcion || ""}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" sx={{ width: "100%" }}>
            <InputLabel>Tipo parámetro</InputLabel>
            <Select

              label="Tipo parámetro"

              value={tipoParametro}
              onChange={(e) => setTipoParametro(e.target.value)}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <em style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                      {tipoParametro}
                    </em>
                  );
                }
                return selected;
              }}
            >
              <MenuItem disabled value="">
                <em>Tipo parámetro</em>
              </MenuItem>
              <MenuItem value={"general"}>General</MenuItem>
              <MenuItem value={"programacion"}>Programación</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" sx={{ width: "100%" }}>
            <InputLabel>Grupo</InputLabel>
            <Select
              label="Grupo"
             value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <em style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                      {grupo}
                    </em>
                  );
                }
                return selected;
              }}
            >
              <MenuItem disabled value="">
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
              <MenuItem value={"Temperatura programa"}>Temperatura programa</MenuItem>
              <MenuItem value={"Deshielo programa"}>Deshielo programa</MenuItem>
              <MenuItem value={"Alarma programa"}>Alarma programa</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" sx={{ width: "100%" }}>
            <InputLabel>Tipo de campo</InputLabel>
            <Select
              label="Tipo de campo"
              value={tipoCampo}
              onChange={(e) => setTipoCampo(e.target.value)}
              disabled
            >
              <MenuItem value="">
                <em>Tipo de campo</em>
              </MenuItem>
              <MenuItem value={"rango"}>Rango</MenuItem>
              <MenuItem value={"opciones"}>Opciones</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}></Grid>
        {tipoCampo === "rango" && (
          <Grid item xs={6}>
            <Paper variant="outlined" style={{ padding: 15 }}>
              <Grid container direction="column">
                <Grid item>
                  <FormLabel>Rango</FormLabel>
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="standard" >
                    <InputLabel>Unidad</InputLabel>
                    <Select
                      {...register("unidad")}
                      value={unidad || ""}
                      onChange={(e) => setUnidad(e.target.value)}
                      error={errors.unidad ? true : false}
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <em style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                              {unidad}
                            </em>
                          );
                        }
                        return selected;
                      }}
                    >
                      <MenuItem value="">
                        <em>Unidad</em>
                      </MenuItem>
                      <MenuItem value={"h"}>Horas</MenuItem>
                      <MenuItem value={"min"}>Minutos</MenuItem>
                      <MenuItem value={"s"}>Segundos</MenuItem>
                      <MenuItem value={"°C"}>Centigrados</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <TextField
                    {...register("valor_min", { required: true })}
                    label="Valor mínimo"
                    variant="standard"
                    value={valorMinimo}
                    onChange={(e) => setValorMinimo(e.target.value)}
                    error={errors.valor_min ? true : false}
                    helperText={errors.valor_min ? "Este campo es requerido" : ""}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    {...register("valor_max", { required: true })}
                    label="Valor máximo"
                    variant="standard"
                    value={valorMaximo}
                    onChange={(e) => setValorMaximo(e.target.value)}
                    error={errors.valor_max ? true : false}
                    helperText={errors.valor_max ? "Este campo es requerido" : ""}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
        {tipoCampo === "opciones" && (
          <Grid item xs={6}>
            <Paper variant="outlined" style={{ padding: 15 }}>
              <FormLabel>
                Agregar opción:
                <IconButton aria-label="Agregar parámetro" onClick={handleClickOpenOptions}>
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
                    editable={true}

                  />
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">¿Es un valor fijo?</FormLabel>
            <RadioGroup
              {...register("esValorFijo")}
              value={esValorFijo.toString()}
              onChange={(e) => setEsValorFijo(e.target.value === "true")}
            >
              <FormControlLabel value="true" control={<Radio />} label="Sí" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {esValorFijo && (
          <Grid item xs={6}>
            <TextField
              {...register("valorFijo", { required: esValorFijo })}
              fullWidth
              label="Valor Fijo"
              variant="standard"
              defaultValue={valorFijo}
              onChange={(e) => setValorFijo(e.target.value)}
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
        <Grid item xs={12}>
          <Grid container sx={{ justifyContent: "flex-end" }} spacing={2}>
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
    <Grid container padding={2} justifyContent={"center"}>
      {renderModal()}
      <Grid item xs={12}>
        <HeaderContent titulo="Editar parámetro" />
        <Paper style={{ padding: 20 }}>
          {renderForm()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EditarParametro;
