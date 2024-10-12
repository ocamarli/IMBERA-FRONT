import React, { useEffect } from "react";
import { Typography, Grid, Divider, List, ListItem, ListItemText, IconButton, Avatar, ListItemAvatar,Tooltip, Paper, Tabs, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/ModeEdit";
import AddIcon from "@mui/icons-material/Add";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonIcon from "@mui/icons-material/Person";
import HeaderContent from "../HeaderContent";
import AgregarUsuario from "./AgregarUsuario";
import EditarUsuario from "./EditarUsuario";
import UsuarioAutorizado from "../../components/UsuarioAutorizado";
import ModalGenerico from "../../components/ModalGenerico";
import { useUsuarioService } from "../../hooks/useUsuarioService.jsx";
import LoadingComponent from "../LoadingComponent.jsx";

const ListaUsuarios = ({ setSelectedComponent, auth, onResponse }) => {

  const theme = useTheme();
  const {
    activeTab,
    handleTabChange,
    usuarios,
    isLoading,
    fetchUsuarios,
    handleHabilitarUsuario,
    handleDeshabilitarUsuario,
    cerrarModalOk,
    cerrarModalConfirmacionDeshabilitar,
    cerrarModalConfirmacionHabilitar,
    estaActivoModalOk,
    respuestaModalOk,
    estaActivoModalConfirmacionHabilitar,
    respuestaModalConfirmacionHabilitar,
    estaActivoModalConfirmacionDeshabilitar,
    respuestaModalConfirmacionDeshabilitar,
  } = useUsuarioService(onResponse);

  useEffect(() => {
    fetchUsuarios(true);
  }, [fetchUsuarios]);

  const handleClickAgregarUsuario = () => {
    setSelectedComponent(<AgregarUsuario setSelectedComponent={setSelectedComponent} auth={auth} />);
  };

  const handleEditarUsuario = (idUsuario) => {
    setSelectedComponent(<EditarUsuario idUsuario={idUsuario} setSelectedComponent={setSelectedComponent} auth={auth} />);
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

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
      <ModalGenerico
        open={estaActivoModalConfirmacionDeshabilitar}
        onClose={cerrarModalConfirmacionDeshabilitar}
        title="Confirmación"
        message={respuestaModalConfirmacionDeshabilitar.msg}
        actions={[
          { label: "Confirmar", handler: () => cerrarModalConfirmacionDeshabilitar(true), color: "primary" },
          { label: "Cancelar", handler: () => cerrarModalConfirmacionDeshabilitar(false), color: "error" },
        ]}
      />
      <ModalGenerico
        open={estaActivoModalConfirmacionHabilitar}
        onClose={cerrarModalConfirmacionHabilitar}
        title="Confirmación"
        message={respuestaModalConfirmacionHabilitar.msg}
        actions={[
          { label: "Confirmar", handler: () => cerrarModalConfirmacionHabilitar(true), color: "primary" },
          { label: "Cancelar", handler: () => cerrarModalConfirmacionHabilitar(false), color: "error" },
        ]}
      />
    </>
  );

  const renderUserList = () => (
    <List sx={{ width: "100%" }}>
      {usuarios.filter(usuario => !(usuario.correo === "system" && !auth.permisos.system))
      .map((usuario, index) => (
        <React.Fragment key={index}>
          <ListItem alignItems="flex-start">
            <Grid container>
              <Grid item xs={10}>
                <Grid container>
                  <Grid item sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                    <ListItemAvatar>
                      <Avatar alt={usuario.nombre} src={`/static/images/avatar/${index + 1}.jpg`} />
                    </ListItemAvatar>
                  </Grid>
                  <Grid item>
                    <ListItemText
                      primary={usuario.nombre}
                      secondary={
                        <React.Fragment>
                          <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                            {usuario.correo}
                            <br />
                          </Typography>
                          {Object.entries(usuario.permisos).map(
                            ([permiso, tienePermiso]) => tienePermiso && <span key={permiso}>{permiso}, </span>
                          )}
                        </React.Fragment>
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {activeTab === 0 ? (
                  <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario"]}>
                  <Tooltip title="Habilitar usuario">
                    <IconButton onClick={() => handleHabilitarUsuario(usuario.idUsuario)} aria-label="habilitar">
                      <PersonIcon />
                    </IconButton>
                  </Tooltip>
                  </UsuarioAutorizado>
                ) : (
                  <>
                  <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario"]}>
                    <Tooltip title="Deshabilitar usuario">
                      <IconButton onClick={() => handleDeshabilitarUsuario(usuario.idUsuario)} aria-label="deshabilitar">
                        <PersonOffIcon />
                      </IconButton>
                    </Tooltip>
                    </UsuarioAutorizado>
                    <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario"]}>
                    <Tooltip title="Editar usuario">
                      <IconButton onClick={() => handleEditarUsuario(usuario.idUsuario)} aria-label="editar">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    </UsuarioAutorizado>
                  </>
                )}
              </Grid>
            </Grid>
          </ListItem>
          {index !== usuarios.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Grid container padding={2}>
      <Grid item xs={12}>
        {renderModals()}
        <HeaderContent titulo="Lista de usuarios" />
        <Paper style={{ padding: 20 }}>
          <Grid container spacing={3}>
            
              <Grid item xs={8} sx={{ display: "flex", justifyContent: "left" }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Activos" value={1} />
                  <Tab label="Deshabilitados" value={0} />
                </Tabs>
              </Grid>
              <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario"]}>  
              <Grid item xs={4} sx={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
                <Typography variant="h6">Agregar usuario nuevo</Typography>
                <IconButton
                  variant="contained"
                  sx={{ borderRadius: "50%", backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText, marginLeft: "10px" }}
                  onClick={handleClickAgregarUsuario}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </UsuarioAutorizado>
            <Grid item xs={12}>
              {renderUserList()}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ListaUsuarios;