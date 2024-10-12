import { useForm } from "react-hook-form";
import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  FormControl,
  Grid,
  Paper,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { crearReceta } from "../../api/axios";
import ComponentePestana from "../../components/ComponentePestana";
import { obtenerParametros } from "../../api/parametrosApi";
import HeaderContent from "../HeaderContent";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { handleOnChangeInputTextoNumero } from "../../utils";
const EditarPlantilla = (props) => {
  const { onResponse, auth } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [parametros, setParametros] = useState([]);

  const [autorizaciones, setAutorizaciones] = useState({
    superusuario: false,
    refrigeracion: false,
    laboratorio: false,
    servicios: false,
  });
  const [bloqueado, setBloqueado] = useState(false);

  const alternarBloqueo = () => {
    setBloqueado(!bloqueado);
  };
  const dataActivas = [
    {
      id: 1,
      autor: "Juan",
      familia: "Familia A",
      hardware: "Hardware 1",
      estatus: "Activo",
      plantillas: 3,
    },
    {
      id: 2,
      autor: "María",
      familia: "Familia B",
      hardware: "Hardware 2",
      estatus: "Activo",
      plantillas: 5,
    },
  ];

  const dataObsoletas = [
    {
      id: 3,
      autor: "Pedro",
      familia: "Familia C",
      hardware: "Hardware 3",
      estatus: "Obsoleta",
      plantillas: 2,
    },
    {
      id: 4,
      autor: "Ana",
      familia: "Familia D",
      hardware: "Hardware 4",
      estatus: "Obsoleta",
      plantillas: 4,
    },
  ];

  const tabs = [
    {
      label: "Parametros programación",
      content: (
        <ComponentePestana
          data={dataActivas}
          // Otros props que necesites pasar al componente de tabla
        />
      ),
    },
    {
      label: "Parametros fijos",
      content: (
        <ComponentePestana
          data={dataObsoletas}
          // Otros props que necesites pasar al componente de tabla
        />
      ),
    },
  ];
  console.log("auth");
  console.log(auth);
  const handleCrearReceta = async (data) => {
    const list = [];
    parametros.map((param) => {
      list.push({ idParametro: param, valor: "", estado: false });
      return null;
    });

    const newData = { ...data, parametros: list };
    console.log(newData);
    const response = await crearReceta(
      newData,
      JSON.parse(sessionStorage.getItem("ACCSSTKN")).access_token
    );
    console.log("response", response);
    if (response.status) {
      console.log("YES");

      handleClose();
    } else {
      console.log("Error");
    }
  };
  const onSubmit = (data) => {
    console.log("onsub");
    console.log(data);
    handleCrearReceta(data);
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setAutorizaciones((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const fetchparametros = useCallback(async () => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      console.log(tkn);
      if (tkn !== undefined) {
        const json = await obtenerParametros(tkn);
        console.log(json);
        setParametros(json.parameters || []);
        setIsLoading(false);
      } else {
        setParametros([]);
        onResponse({ status: false, msg: "Unauthorized Access" });
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, [setIsLoading, setParametros, onResponse]);

  const handleClose = useCallback(async () => {
    await fetchparametros();
  }, [fetchparametros]);

  useEffect(() => {
    fetchparametros();
  }, [fetchparametros]);
  return (
    <Grid container padding={1}>
      <Grid item xs={12}>
        {isLoading && ( // Agrega el loader condicionalmente
          <Grid item xs={12} align="center">
            <CircularProgress size={50} />
          </Grid>
        )}
        <HeaderContent></HeaderContent>
        <Paper style={{ padding: 10 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography>Familia</Typography>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                  <Select
                    {...register("familia", { required: true })}
                    size="small"
                    error={errors.familia ? true : false}
                    defaultValue="" // Asegúrate de dejar este defaultValue vacío
                    displayEmpty // Esta propiedad garantiza que el elemento seleccionado muestre el placeholder cuando esté vacío
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <em style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                            Selecciona una familia
                          </em>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Selecciona una familia</em>
                    </MenuItem>
                    <MenuItem value={"Familia 1"}>Familia 1</MenuItem>
                    <MenuItem value={"Familia 1"}>Familia 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography>Hardware</Typography>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                  <Select
                    {...register("hardware", { required: true })}
                    size="small"
                    error={errors.hardware ? true : false}
                    defaultValue="" // Asegúrate de dejar este defaultValue vacío
                    displayEmpty // Esta propiedad garantiza que el elemento seleccionado muestre el placeholder cuando esté vacío
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <em style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                            Selecciona una hardware
                          </em>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Selecciona una hardware</em>
                    </MenuItem>
                    <MenuItem value={"Hardware 2"}>Hardware 1</MenuItem>
                    <MenuItem value={"Hardware 2"}>Hardware 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography>Última nota</Typography>
                <TextField
                  {...register("ultima_nota", { required: true })}
                  onChange={handleOnChangeInputTextoNumero}
                  size="small"
                  fullWidth
                  placeholder="Última nota"
                  variant="outlined"
                  error={errors.ultima_nota ? true : false}
                  helperText={
                    errors.ultima_nota ? "Este campo es requerido" : ""
                  }
  
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Plantilla</Typography>
                <FormControl variant="outlined" sx={{ width: "100%" }}>
                  <Select
                    {...register("plantila", { required: true })}
                    size="small"
                    error={errors.plantila ? true : false}
                    defaultValue="" // Asegúrate de dejar este defaultValue vacío
                    displayEmpty // Esta propiedad garantiza que el elemento seleccionado muestre el placeholder cuando esté vacío
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <em style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                            Selecciona una plantilla
                          </em>
                        );
                      }
                      return selected;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Selecciona una plantilla</em>
                    </MenuItem>
                    <MenuItem value={"Plantila 1"}>Plantila 1</MenuItem>
                    <MenuItem value={"plantila 2"}>plantila 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Usuario del propietario</InputLabel>
                <TextField
                  {...register("propietario", { required: true })}
                  onChange={handleOnChangeInputTextoNumero}
                  size="small"
                  fullWidth
                  placeholder="Usuario del propietario"
                  variant="outlined"
                  error={errors.propietario ? true : false}
                  helperText={
                    errors.propietario ? "Este campo es requerido" : ""
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Autoriza</InputLabel>
                <TextField
                  {...register("autoriza", { required: true })}
                  onChange={handleOnChangeInputTextoNumero}
                  size="small"
                  fullWidth
                  placeholder="Autoriza"
                  variant="outlined"
                  error={errors.autoriza ? true : false}
                  helperText={errors.autoriza ? "Este campo es requerido" : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Bloquear</InputLabel>
                <Button
                  {...register("bloquear", { required: true })}
                  size="small"
                  onClick={alternarBloqueo}
                  variant="contained"
                  style={{
                    backgroundColor: bloqueado ? "red" : "blue",
                  }}
                  startIcon={bloqueado ? <LockIcon /> : <LockOpenIcon />}
                  error={errors.bloquear ? true : false}
                  helperText={errors.bloquear ? "Este campo es requerido" : ""}
                >
                  {bloqueado ? "Bloqueado" : "Desbloqueado"}
                </Button>
              </Grid>
              <Grid item xs={6}></Grid>

              <Grid item xs={12}>
                <Grid container sx={{ justifyContent: "flex-end" }} spacing={2}>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#303030" }}
                      fullWidth
                    >
                      Ver notas
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="contained" fullWidth type="submit">
                      Crear Receta
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <ComponentePestana
                  onResponse={onResponse}
                  tabs={tabs}
                ></ComponentePestana>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EditarPlantilla;
