import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { TextField, FormGroup, FormControlLabel, Checkbox, Button, FormControl, Grid, Paper, Typography, InputLabel } from "@mui/material";
import HeaderContent from "../HeaderContent";
import ModalGenerico from "../../components/ModalGenerico";
import { useUsuarioService } from "../../hooks/useUsuarioService";
import ListaUsuarios from "../Register/ListaUsuarios.jsx"
import LoadingComponent from "../LoadingComponent";
import { handleOnChangeInputTexto } from "../../utils.js";
import CryptoJS from "crypto-js";

const EditarUsuario = ({ idUsuario, setSelectedComponent, onResponse , auth}) => {
  const { setAutorizaciones, autorizaciones, isLoading, handleEditarUsuario, usuario, fetchUsuario, cerrarModalOk, estaActivoModalOk, respuestaModalOk } = useUsuarioService(onResponse);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    fetchUsuario(idUsuario);
  }, [fetchUsuario, idUsuario]);

  const onSubmit = (data) =>{ 
    const secretKey = `${process.env.REACT_APP_SALT}`;
    console.log("Editarrrrrr Usuario")
    const encryptedPassword = CryptoJS.SHA256(data.pwo + secretKey).toString();    
    handleEditarUsuario({ idUsuario, ...data, permisos: autorizaciones ,pwo:encryptedPassword})};


  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (!checked && Object.values(autorizaciones).filter(val => val).length === 1) {
      return;
    }
    setAutorizaciones((prevState) => ({ ...prevState, [name]: checked }));
  };

  const handleOnCLickSalir = () => setSelectedComponent(<ListaUsuarios setSelectedComponent={setSelectedComponent}
    onResponse={onResponse} 
    auth={auth} />);

  if (isLoading || !usuario) {
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
          <Typography>Nombre completo</Typography>
          <TextField
            {...register("nombre", { required: true })}
            fullWidth
            placeholder="Nombre completo"
            variant="outlined"
            error={!!errors.nombre}
            helperText={errors.nombre && "Este campo es requerido"}
            defaultValue={usuario.nombre || ""}
            onChange={handleOnChangeInputTexto}
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Contraseña</InputLabel>
          <TextField
            {...register("pwo", { required: true })}
            fullWidth
            type="password"
            placeholder="Contraseña"
            variant="outlined"
            error={!!errors.pwo}
            helperText={errors.pwo && "Este campo es requerido"}
            defaultValue={usuario.pwo || ""}
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Autorizaciones</Typography>
          <FormControl component="fieldset">
  <FormGroup row>
    {Object.keys(auth.permisos).map((key) => {
      console.log("key", key);
      
      // Mostrar el checkbox de 'system' solo si auth.permisos.system es true
      if (key === 'system' && !auth.permisos.system) {
        return null; // No mostrar el checkbox de 'system' si no tiene permisos
      }

      // No mostrar el checkbox 'superusuario' si auth.permisos.superusuario es true
      if (key === 'superusuario' && auth.permisos.superusuario) {
        return null; // No mostrar el checkbox de 'superusuario' si tiene permisos
      }

      // Renderizar todos los checkboxes restantes
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
                Actualizar usuario
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
      <Grid item xs={7}>
        {renderModal()}
        <HeaderContent titulo={`Editar usuario (${usuario.correo})`} />
        <Paper style={{ padding: 20 }}>
          {renderForm()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EditarUsuario;
