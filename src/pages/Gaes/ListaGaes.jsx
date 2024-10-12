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
import AgregarGae from "./AgregarGae";
import EditarGae from "./EditarGae";
import UsuarioAutorizado from "../../components/UsuarioAutorizado";
import ModalGenerico from "../../components/ModalGenerico";
import { useGaeService } from "../../hooks/useGaeServices";
import Home from "../Home/Home";
import LoadingComponent from "../LoadingComponent";
import { filtrarColumnasPorPermisos } from "../../utils";
function transformarDatos(gaes) {
  return gaes.map((gae, index) => ({
    id: index + 1 || "",
    idGaeInterno: gae.idGaeInterno,
    idGae: gae.idGae || "",
    nombre: gae.nombre || "",
    codigo: gae.codigo || "",
  }));
}

const ListaGaes = ({ setSelectedComponent, auth, onResponse }) => {
  const {
    activeTab,
    handleTabChange,
    handleHabilitarGae,
    gaes,
    isLoading,
    fetchGaes,
    handleDeshabilitarGae,
    cerrarModalOk,
    estaActivoModalOk,
    respuestaModalOk,
    estaActivoModalConfirmacionHabilitar,
    respuestaModalConfirmacionHabilitar,
    cerrarModalConfirmacionHabilitar,
    estaActivoModalConfirmacionDeshabilitar,
    respuestaModalConfirmacionDeshabilitar,
    cerrarModalConfirmacionDeshabilitar,
  } = useGaeService(onResponse);

  useEffect(() => {
    fetchGaes(true);
  }, [fetchGaes]);

  const manejarAgregarPlantilla = () => {
    setSelectedComponent(
      <AgregarGae
        setSelectedComponent={setSelectedComponent}
        auth={auth}
        onResponse={onResponse}
      />
    );
  };

  const handleEditarGae = (idGae) => {
    setSelectedComponent(
      <EditarGae
        idGae={idGae}
        setSelectedComponent={setSelectedComponent}
        auth={auth}
      />
    );
  };

  const columnsActivas = [
    { field: "id", headerName: "ID" },
    { field: "idGaeInterno", headerName: "ID GAE" },
    { field: "nombre", headerName: "Nombre",width:250 },
    { field: "codigo", headerName: "Código" },
    {
      field: "editar",
      headerName: "Editar",
      permisosRequeridos:["system","superusuario"],
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditarGae(params.row.idGae)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "eliminar",
      headerName: "Deshabilitar",
      permisosRequeridos:["system","superusuario"],
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeshabilitarGae(params.row.idGae)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const columnsDeshabilitadas = [
    { field: "id", headerName: "ID" },
    { field: "idGaeInterno", headerName: "ID GAE" },
    { field: "nombre", headerName: "Nombre", width:250 },
    { field: "codigo", headerName: "Código" },
    {
      field: "habilitar",
      headerName: "Habilitar",
      permisosRequeridos:["system","superusuario"],
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleHabilitarGae(params.row.idGae)}>
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
        <HeaderContent titulo="Lista de GAEs" />
        <Paper style={{ padding: 20 }}>
          <Grid container spacing={3}>
            <Grid item xs={8} sx={{ display: "flex", justifyContent: "left" }}>
              
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Activos" value={1} />
                  <Tab label="Deshabilitados" value={0} />
                </Tabs>
              
            </Grid>
            <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario"]}>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Agregar código GAE</Typography>
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
                rows={transformarDatos(gaes)}
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

export default ListaGaes;