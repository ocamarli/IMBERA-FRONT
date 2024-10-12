import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { authenticate } from "../../api/usuariosApi";
import ImagenLogin from "../../imagenes/ImberaLogo.png";
import ImagenPowered from "../../imagenes/powered.png";
import ImagenFondo from "../../imagenes/fondo-login.png";
import ModalGenerico from "../../components/ModalGenerico";
import CryptoJS from "crypto-js"; 

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://vikkon.com.mx/">
        {new Date().getFullYear()}
        {"."}
      </Link>{" "}
    </Typography>
  );
}

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const cerrarModal = () => {
    setEstaActivo(false); // Restablecer el estado a false cuando se cierra el modal
  };
  const [estaActivo, setEstaActivo] = useState(false);
  const [respuestaModal, setRespuestaModal] = useState(false);

  const fetchAuth = async (data) => {
    const response = await authenticate(data);

    if (response.status) {

      sessionStorage.setItem(
        "ACCSSTKN",
        JSON.stringify({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        })
      );
      navigate("/Menu");
    } else {
      console.log("Error");
      setEstaActivo(true);
      setRespuestaModal(response);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let usuario = event.target.form[0].value;
    let pwo = event.target.form[1].value;
    
    const secretKey = `${process.env.REACT_APP_SALT}`;

    const encryptedPassword = CryptoJS.SHA256(pwo + secretKey).toString();

    // Preparar los datos a enviar
    let data = {
      usuario: usuario,
      pwo: encryptedPassword, // Enviar la contraseña cifrada
    };

    fetchAuth(data);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {console.log("Theme type:", theme.palette.type)}

      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={9}
        sx={{
          backgroundImage: "url(" + ImagenFondo + ")",
          backgroundRepeat: "no-repeat",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[50]
              : theme.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={3} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 10,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <img src={ImagenLogin} alt="Logo" />
          </Grid>
          <Typography component="h1" variant="h5" sx={{ mt: 4, mb: 2 }}>
            Iniciar Sesión
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <form>
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                label="Usuario"
                name="usuario"
                autoFocus
              />
              <TextField
                margin="normal"
                variant="standard"
                required
                fullWidth
                name="pwo"
                label="Contraseña"
                type="password"
                autoComplete="contraseña actual"
              />
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                sx={{ mt: 10, mb: 2 }}
                onClick={handleSubmit}
              >
                Iniciar Sesión
              </Button>
            </form>
          </Box>
          {/* Contenedor para centrar el logo "powered" */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              mt: 29,
            }}
          >
            <img src={ImagenPowered} alt="Powered Logo" width={"40%"} />
          </Box>
          <Copyright sx={{ mt: 3 }} />
        </Box>
      </Grid>
      <ModalGenerico
        tipoModal={respuestaModal.status}
        open={estaActivo}
        onClose={cerrarModal}
        title={respuestaModal.status ? "Correcto" : "Advertencia"}
        message={respuestaModal.msg}
        autoCierre={true}
      />
    </Grid>
  );
}
