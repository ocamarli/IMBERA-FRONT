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
import AgregarFirmware from "./AgregarFirmware";
import EditarFirmware from "./EditarFirmware";
import UsuarioAutorizado from "../../components/UsuarioAutorizado";
import ModalGenerico from "../../components/ModalGenerico";
import { useFirmwareService } from "../../hooks/useFirmwareService";
import Home from "../Home/Home";
import LoadingComponent from "../LoadingComponent";
import { filtrarColumnasPorPermisos } from "../../utils";
function transformarDatos(firmwares) {
  return firmwares.map((firmware, index) => ({
    id: index + 1 || "",
    idFirmwareInterno: firmware.idFirmwareInterno,
    idFirmware: firmware.idFirmware || "",
    nombre: firmware.nombre || "",
  }));
}

const ListaFirmwares = ({ setSelectedComponent, auth, onResponse }) => {
  const {
    activeTab,
    handleTabChange,
    handleHabilitarFirmware,
    firmwares,
    isLoading,
    fetchFirmwares,
    handleDeshabilitarFirmware,
    cerrarModalOk,
    estaActivoModalOk,
    respuestaModalOk,
    estaActivoModalConfirmacionHabilitar,
    respuestaModalConfirmacionHabilitar,
    cerrarModalConfirmacionHabilitar,
    estaActivoModalConfirmacionDeshabilitar,
    respuestaModalConfirmacionDeshabilitar,
    cerrarModalConfirmacionDeshabilitar,
  } = useFirmwareService(onResponse);

  useEffect(() => {
    fetchFirmwares(true);
  }, [fetchFirmwares]);

  const manejarAgregarPlantilla = () => {
    setSelectedComponent(
      <AgregarFirmware
        setSelectedComponent={setSelectedComponent}
        auth={auth}
        onResponse={onResponse}
      />
    );
  };

  const handleEditarFirmware = (idFirmware) => {
    setSelectedComponent(
      <EditarFirmware
        idFirmware={idFirmware}
        setSelectedComponent={setSelectedComponent}
        auth={auth}
      />
    );
  };

  const columnsActivas = [
    { field: "id", headerName: "ID" },
    { field: "idFirmwareInterno", headerName: "ID firmware" },
    { field: "nombre", headerName: "Nombre",width:250 },
    {
      field: "editar",
      headerName: "Editar",
      permisosRequeridos:["system"],      
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditarFirmware(params.row.idFirmware)}>
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
        <IconButton onClick={() => handleDeshabilitarFirmware(params.row.idFirmware)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const columnsDeshabilitadas = [
    { field: "id", headerName: "ID" },
    { field: "idFirmwareInterno", headerName: "ID firmware" },
    { field: "nombre", headerName: "Nombre",width:250 },
    {
      field: "habilitar",
      headerName: "Habilitar",
      permisosRequeridos:["system"],
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleHabilitarFirmware(params.row.idFirmware)}>
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
        <HeaderContent titulo="Lista de firmwares" />
        <Paper style={{ padding: 20 }}>
          <Grid container spacing={3}>
            <Grid item xs={8} sx={{ display: "flex", justifyContent: "left" }}>
              
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Activos" value={1} />
                  <Tab label="Deshabilitados" value={0} />
                </Tabs>
              
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
              <Typography variant="h6">Agregar código firmware</Typography>
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
                rows={transformarDatos(firmwares)}
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

export default ListaFirmwares;