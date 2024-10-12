import { styled, useTheme } from "@mui/material/styles";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import MuiAppBar from "@mui/material/AppBar";
import {
  Typography,
  Divider,
  Toolbar,
  List,
  Box,
  Drawer,
  CssBaseline,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  FormControl,
} from "@mui/material/";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ListaParametros from "./Parametros/ListaParametros";
import Home from "./Home/Home";
import "./MenuCss.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import imgHeader from "./imberaLogoMenu.png";
import { alpha } from "@mui/material/";
import ListaPlantillas from "./Plantillas/ListaPlatillas";
import ListaUsuarios from "./Register/ListaUsuarios";
import UsuarioAutorizado from "../components/UsuarioAutorizado";
import ListaGaes from "./Gaes/ListaGaes";
import ListaFirmwares from "./Firmwares/ListaFirmwares";
import ListaHardwares from "./Hardwares/ListaHardwares";
import ApiIcon from "@mui/icons-material/Api";
import HardwareIcon from "@mui/icons-material/Hardware";
import CodeIcon from "@mui/icons-material/Code";
import Codigos from "./Codigos/Codigos";

const drawerWidth = 250;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,

    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { onDarkModeChange, auth } = props;
  const [open, setOpen] = React.useState(false);
  const [selectedComponent, setSelectedComponent] = useState(<Home />);

  const [openAlert, setOpenAlert] = React.useState(false);
  const [response, setResponse] = React.useState();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };
  const seleccionarCodigos = () => {
    setSelectedComponent(
      <Codigos
        onResponse={(json) => {
          setResponse(json);
          setOpenAlert(true);
        }}
        auth={auth}
        setSelectedComponent={setSelectedComponent}
      />
    );
  };
  const seleccionarListaUsuarios = () => {
    setSelectedComponent(
      <ListaUsuarios
        auth={auth}
        setSelectedComponent={setSelectedComponent}
        onResponse={(json) => {
          setResponse(json);
          setOpenAlert(true);
        }}
      />
    );
  };
  const seleccionarListaPlantillas = () => {
    setSelectedComponent(
      <ListaPlantillas
        onResponse={(json) => {
          setResponse(json);
          setOpenAlert(true);
        }}
        auth={auth}
        setSelectedComponent={setSelectedComponent}
      />
    );
  };
  const seleccionarListaGaes = () => {
    setSelectedComponent(
      <ListaGaes
        onResponse={(json) => {
          setResponse(json);
          setOpenAlert(true);
        }}
        auth={auth}
        setSelectedComponent={setSelectedComponent}
      />
    );
  };
  const seleccionarListaHardwares = () => {
    setSelectedComponent(
      <ListaHardwares
        onResponse={(json) => {
          setResponse(json);
          setOpenAlert(true);
        }}
        auth={auth}
        setSelectedComponent={setSelectedComponent}
      />
    );
  };
  const seleccionarListaFirmwares = () => {
    setSelectedComponent(
      <ListaFirmwares
        onResponse={(json) => {
          setResponse(json);
          setOpenAlert(true);
        }}
        auth={auth}
        setSelectedComponent={setSelectedComponent}
      />
    );
  };
  const selectHome = () => {
    setSelectedComponent(<Home />);
  };
  const selectParameters = () => {
    setSelectedComponent(
      <ListaParametros
        auth={auth}
        setSelectedComponent={setSelectedComponent}
        onResponse={(json) => {
          setResponse(json);
          setOpenAlert(true);
        }}
      />
    );
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    onDarkModeChange();
  };
  const logOut = () => {
    sessionStorage.removeItem("ACCSSTKN");
    navigate("/");
  };
  const iconsStyle = {
    color: "#303030",
  };
  const classes = {
    root: {
      width: "100%",
      maxWidth: 360,
      padding: "15px",
      borderRadius: "3px",
    },
    nested: {
      paddingLeft: 40,
    },
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ height: "60px" }}>
        <Toolbar
          style={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />

          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Typography>
              {auth !== null ? (
                <React.Fragment>
                  {auth.nombre} (
                  {Object.keys(auth.permisos)
                    .filter((permiso) => auth.permisos[permiso])
                    .join(", ")}
                  )
                </React.Fragment>
              ) : (
                "Usuario"
              )}
            </Typography>
            <Avatar sx={{ ml: 2 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader
          sx={{
            justifyContent: "space-between",
            display: "flex",
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          }}
        >
          <Box sx={{ width: "80%", display: "flex", justifyContent: "center" }}>
            <img src={imgHeader} alt="Imagen de cabecera" width="50%" />
          </Box>
          <Box sx={{ width: "20%" }}>
            <IconButton
              onClick={handleDrawerClose}
              sx={{ backgroundColor: alpha("#dddddd", 0.3) }}
            >
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon sx={{ color: "#ffffff" }} />
              ) : (
                <ChevronRightIcon sx={{ color: "#ffffff" }} />
              )}
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <FormControl style={classes.root}>
          <List>
            <ListItemButton onClick={selectHome}>
              <ListItemIcon>
                <HomeIcon sx={iconsStyle} />
              </ListItemIcon>
              <ListItemText primary="Página principal" />
            </ListItemButton>
            <UsuarioAutorizado
              usuario={auth}
              permisosRequeridos={[
                "system",
                "superusuario",
                "electrico",
                "refrigeracion",
                "laboratorio",
              ]}
            >
              <ListItemButton onClick={seleccionarListaPlantillas}>
                <ListItemIcon>
                  <FormatListNumberedIcon sx={iconsStyle} />
                </ListItemIcon>
                <ListItemText primary="Plantillas" />
              </ListItemButton>
            </UsuarioAutorizado>

            <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario","electrico","laboratorio"]}>
              <ListItemButton onClick={selectParameters}>
                <ListItemIcon>
                  <DescriptionIcon sx={iconsStyle} />
                </ListItemIcon>
                <ListItemText primary="Parámetros" />
              </ListItemButton>
            </UsuarioAutorizado>
            <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario","electrico","laboratorio","refrigeracion"]}>
            <ListItemButton onClick={seleccionarListaGaes}>
              <ListItemIcon>
                <DescriptionIcon sx={iconsStyle} />
              </ListItemIcon>
              <ListItemText primary="GAEs" />
            </ListItemButton>
            </UsuarioAutorizado>
            <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario","electrico","laboratorio","refrigeracion"]}>
            <ListItemButton onClick={seleccionarListaFirmwares}>
              <ListItemIcon>
                <ApiIcon sx={iconsStyle} />
              </ListItemIcon>
              <ListItemText primary="Firmwares" />
            </ListItemButton>
            </UsuarioAutorizado>
            <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario","electrico","laboratorio","refrigeracion"]}> 
            <ListItemButton onClick={seleccionarListaHardwares}>
              <ListItemIcon>
                <HardwareIcon sx={iconsStyle} />
              </ListItemIcon>
              <ListItemText primary="Hardwares" />
            </ListItemButton>
            </UsuarioAutorizado>
            <UsuarioAutorizado usuario={auth} permisosRequeridos={["system"]}>
            
              <ListItemButton onClick={seleccionarCodigos}>
                <ListItemIcon>
                  <CodeIcon sx={iconsStyle} />
                </ListItemIcon>
                <ListItemText primary="Códigos" />
              </ListItemButton>
            </UsuarioAutorizado>

            <Divider />
            <UsuarioAutorizado
              usuario={auth}
              permisosRequeridos={["system","superusuario","electrico","laboratorio"]}
            >
              <ListItemButton onClick={seleccionarListaUsuarios}>
                <ListItemIcon>
                  <PersonAddIcon sx={iconsStyle} />
                </ListItemIcon>
                <ListItemText>Usuarios</ListItemText>
              </ListItemButton>
            </UsuarioAutorizado>
          </List>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            flexGrow: 1,
            height: "60px",
          }}
        >
          <Divider />
          <List>
            <ListItemButton color="inherit" onClick={toggleDarkMode}>
              <ListItemIcon>
                {darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
              </ListItemIcon>
              <ListItemText
                primary={darkMode ? "Claro" : "Oscuro"}
                className="listItemText"
              />
            </ListItemButton>

            <ListItemButton onClick={logOut}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Main
        open={open}
        sx={{
          height: "100vh",
        }}
      >
        <DrawerHeader />

        <SwitchTransition>
          <CSSTransition
            key={selectedComponent.type}
            timeout={400}
            classNames="item"
            unmountOnExit
          >
            {selectedComponent}
          </CSSTransition>
        </SwitchTransition>
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert
            onClose={handleAlertClose}
            severity={response?.status ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {response?.msg}
          </Alert>
        </Snackbar>
      </Main>
    </Box>
  );
}
