import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, FormGroup, FormControlLabel, Checkbox, Button, FormControl, Grid, Paper, Typography, InputLabel } from "@mui/material";
import HeaderContent from "../HeaderContent";
import ModalGenerico from "../../components/ModalGenerico";
import ListaUsuarios from "../Register/ListaUsuarios.jsx";
import { useUsuarioService } from "../../hooks/useUsuarioService.jsx";
import { handleOnChangeInputTexto } from "../../utils.js";
import CryptoJS from "crypto-js";

const AgregarUsuario = ({ setSelectedComponent, onResponse, auth }) => {
  console.log("auth", auth);
  const { cerrarModalOk, handleCrearUsuario, estaActivoModalOk, respuestaModalOk } = useUsuarioService(onResponse);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [autorizaciones, setAutorizaciones] = useState({
    superusuario: false,
    electrico: false,
    refrigeracion: true,
    laboratorio: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setAutorizaciones((prevState) => ({ ...prevState, [name]: checked }));
  };

  const handleOnChangeCorreo = (e) => {
    e.target.value = e.target.value.trim();
  };

  const handleOnCLickSalir = () => {
    setSelectedComponent(<ListaUsuarios setSelectedComponent={setSelectedComponent} onResponse={onResponse} auth={auth} />);
  };

  const onSubmit = (data) => {
  

    console.log("daaataa",data)


    const secretKey = `${process.env.REACT_APP_SALT}`;
    const encryptedPassword = CryptoJS.SHA256(data.pwo + secretKey).toString();

    
    // Preparar los datos para crear el usuario, incluyendo la contraseña cifrada
    const usuarioData = {
      ...data,
      permisos: autorizaciones,
      estatus: true,
      pwo: encryptedPassword, // Reemplazar la contraseña original con la cifrada
    };

    handleCrearUsuario(usuarioData);
  };

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
          <Typography>Nombre completo</Typography>
          <TextField
            {...register("nombre", { required: true })}
            fullWidth
            placeholder="Nombre completo"
            variant="outlined"
            error={!!errors.nombre}
            helperText={errors.nombre && "Este campo es requerido"}
            onChange={handleOnChangeInputTexto}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography>Correo electrónico</Typography>
          <TextField
            type="email"
            {...register("correo", { required: true })}
            fullWidth
            placeholder="Correo electrónico"
            variant="outlined"
            error={!!errors.correo}
            helperText={errors.correo && "Este campo es requerido"}
            onChange={handleOnChangeCorreo}
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Contraseña</InputLabel>
          <TextField
            type="password"
            {...register("pwo", { required: true })}
            fullWidth
            placeholder="Contraseña"
            variant="outlined"
            error={!!errors.pwo}
            helperText={errors.pwo && "Este campo es requerido"}
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Autorizaciones
          </Typography>
          <FormControl component="fieldset">
            <FormGroup row>
              {Object.keys(auth.permisos).map((key) => {
                console.log("key", key);

                if (key === 'system' && !auth.permisos.system) {
                  return null;
                }

                if (key === 'superusuario' && auth.permisos.superusuario) {
                  return null;
                }

                return (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={autorizaciones[key]}
                        onChange={handleCheckboxChange}
                        name={key}
                      />
                    }
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                );
              })}
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Grid container sx={{ justifyContent: "space-around" }} spacing={2}>
            <Grid item xs={6}>
              <Button variant="contained" type="submit" sx={{ height: "50px" }} fullWidth>
                Agregar
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
    <Grid container padding={2}>
      <Grid item xs={12}>
        {renderModal()}
        <HeaderContent titulo="Agregar usuario" />
        <Paper style={{ padding: 20 }}>
          {renderForm()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AgregarUsuario;
