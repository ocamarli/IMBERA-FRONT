import React, { useEffect } from "react";
import {
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Check as CheckIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import HeaderContent from "../HeaderContent";
import AgregarHardware from "./AgregarHardware";
import EditarHardware from "./EditarHardware";
import UsuarioAutorizado from "../../components/UsuarioAutorizado";
import ModalGenerico from "../../components/ModalGenerico";
import { useHardwareService } from "../../hooks/useHardwareService";
import Home from "../Home/Home";
import LoadingComponent from "../LoadingComponent";
import { filtrarColumnasPorPermisos } from "../../utils";
function transformarDatos(hardwares) {
  return hardwares.map((hardware, index) => ({
    id: index + 1 || "",
    idHardwareInterno: hardware.idHardwareInterno,
    idHardware: hardware.idHardware || "",
    nombre: hardware.nombre || "",
  }));
}

const ListaHardwares = ({ setSelectedComponent, auth, onResponse }) => {
  const {
    activeTab,
    handleTabChange,
    handleHabilitarHardware,
    hardwares,
    isLoading,
    fetchHardwares,
    handleDeshabilitarHardware,
    cerrarModalOk,
    estaActivoModalOk,
    respuestaModalOk,
    estaActivoModalConfirmacionHabilitar,
    respuestaModalConfirmacionHabilitar,
    cerrarModalConfirmacionHabilitar,
    estaActivoModalConfirmacionDeshabilitar,
    respuestaModalConfirmacionDeshabilitar,
    cerrarModalConfirmacionDeshabilitar,
  } = useHardwareService(onResponse);

  useEffect(() => {
    fetchHardwares(true);
  }, [fetchHardwares]);

  const manejarAgregarPlantilla = () => {
    setSelectedComponent(
      <AgregarHardware
        setSelectedComponent={setSelectedComponent}
        auth={auth}
        onResponse={onResponse}
      />
    );
  };

  const handleEditarHardware = (idHardware) => {
    setSelectedComponent(
      <EditarHardware
        idHardware={idHardware}
        setSelectedComponent={setSelectedComponent}
        auth={auth}
      />
    );
  };

  const columnsActivas = [
    { field: "id", headerName: "ID" },
    { field: "idHardwareInterno", headerName: "ID hardware" },
    { field: "nombre", headerName: "Nombre",width:250},
    {
      field: "editar",
      headerName: "Editar",
      permisosRequeridos:["system"],
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditarHardware(params.row.idHardware)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "eliminar",
      headerName: "Deshabilitar",
      permisosRequeridos:["system"],
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeshabilitarHardware(params.row.idHardware)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const columnsDeshabilitadas = [
    { field: "id", headerName: "ID" },
    { field: "idHardwareInterno", headerName: "ID hardware" },
    { field: "nombre", headerName: "Nombre",width:250 },
    {
      field: "habilitar",
      headerName: "Habilitar",
      permisosRequeridos:["system"],
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleHabilitarHardware(params.row.idHardware)}>
          <CheckIcon />
        </IconButton>
      ),
    },
  ];

  const renderModals = () => (
    <>
      <ModalGenerico
        tipoModal={respuestaModalOk.status}
        open={estaActivoModalOk}
        onClose={cerrarModalOk}
        title="Correcto"
        message={respuestaModalOk.msg}
        autoCierre={true}
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
    </>
  );

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Grid container padding={2}>
      <Grid item xs={12}>
        {renderModals()}
        <HeaderContent titulo="Lista de hardwares" />
        <Paper style={{ padding: 20 }}>
          <Grid container spacing={3}>
            <Grid item xs={8} sx={{ display: "flex", justifyContent: "left" }}>
              <UsuarioAutorizado usuario={auth} permisosRequeridos={["system"]}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Activos" value={1} />
                  <Tab label="Deshabilitados" value={0} />
                </Tabs>
              </UsuarioAutorizado>
            </Grid>
            <UsuarioAutorizado usuario={auth} permisosRequeridos={["system"]}>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Agregar código hardware</Typography>
              <IconButton
                variant="contained"
                sx={{
                  borderRadius: "50%",
                  backgroundColor: "green",
                  color: "white",
                  marginLeft: "10px",
                }}
                onClick={manejarAgregarPlantilla}
              >
                <AddIcon />
              </IconButton>
            </Grid>
            </UsuarioAutorizado>
            <Grid item xs={12}>
              <DataGrid
                sx={{ maxHeight: "calc(100vh - 330px)", width: "100%" }}
                rows={transformarDatos(hardwares)}
                columns={activeTab === 1 ? filtrarColumnasPorPermisos(columnsActivas,auth) : filtrarColumnasPorPermisos(columnsDeshabilitadas,auth)}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
              />
            </Grid>
          </Grid>
          <Button
            sx={{ mt: 5 }}
            variant="contained"
            color="success"
            onClick={() => setSelectedComponent(<Home />)}
            startIcon={<ArrowBackIcon />}
          >
            Salir
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ListaHardwares;