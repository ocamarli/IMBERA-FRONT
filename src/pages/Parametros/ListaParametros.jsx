import { Typography,IconButton,Tab, Tabs } from "@mui/material";
import React, { useEffect} from "react";
import store from "../../store";
import { Provider } from "react-redux";
import { Grid, Paper, CircularProgress,Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import HeaderContent from "../HeaderContent";
import Home from "../Home/Home.jsx"
import { useParametroService } from "../../hooks/useParametroService";
import ModalGenerico from "../../components/ModalGenerico.jsx";
import LoadingComponent from "../LoadingComponent.jsx";
import AgregarParametro from "./AgregarParametro.jsx";
import UsuarioAutorizado from "../../components/UsuarioAutorizado.jsx";
import { filtrarColumnasPorPermisos } from "../../utils.js";
import {
  Check as CheckIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import EditarParametro from "./EditarParametro.jsx";


function transformarDatos(parametros) {
  console.log(parametros);
  return parametros.map((parametro,index) => {
    let tipoCampoData = "";
    let unidadValor = "";

    console.log(tipoCampoData, unidadValor);
    if (parametro.tipoCampo === "rango") {
      unidadValor = parametro.unidad;

    } else if (parametro.tipoCampo === "opciones") {
      unidadValor = "N.A";

    } else {
      tipoCampoData = "Tipo de campo no reconocido";
    }

    return {
      id: index + 1 || "",
      idParametroInterno:parametro.idParametroInterno,
      idParametro:parametro.idParametro,
      descripcion: parametro.descripcion || "",
      tipoParameto: parametro.tipoParametro || "",
      tipoCampo: parametro.tipoCampo || "",
      rango: parametro.rango || "",
      unidad:parametro.unidad || "",
    };
  });
}


function ListaParametros({setSelectedComponent, auth,onResponse }) {
  const {
    activeTab,
    handleTabChange,
    parametros,
    isLoading,
    fetchParametros,
    cerrarModalOk,
    estaActivoModalOk,
    respuestaModalOk,
    estaActivoModalConfirmacionHabilitar,
    respuestaModalConfirmacionHabilitar,
    cerrarModalConfirmacionHabilitar,
    estaActivoModalConfirmacionDeshabilitar,
    respuestaModalConfirmacionDeshabilitar,
    cerrarModalConfirmacionDeshabilitar,
    handleDeshabilitarParametro,
    handleHabilitarParametro,
  } = useParametroService(onResponse);  

  const columnsActivas = [
    { field: "id", headerName: "ID"},
    { field: "rango", headerName: "Rango", editable: true },
    { field: "unidad", headerName: "Unidad", editable: true },
    { field: "descripcion", headerName: "Descripción", width:450, editable: true},
    { field: "tipoParameto", headerName: "Tipo parámetro", width:120, editable: true},
 
    {
      field: "editar",
      headerName: "Editar",
      permisosRequeridos:["system","superusuario"],      
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditarParametro(params.row.idParametro)}>
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
        <IconButton onClick={() => handleDeshabilitarParametro(params.row.idParametro)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  
  const columnsDeshabilitadas = [
    { field: "id", headerName: "ID" },
    { field: "rango", headerName: "Rango", editable: true },
    { field: "unidad", headerName: "Unidad", editable: true },
    { field: "descripcion", headerName: "Descripción", resizable: true,reorderable: true ,width:320, editable: true},
    { field: "tipoParameto", headerName: "Tipo parámetro",editable: true},

  
    {
      field: "habilitar",
      headerName: "Habilitar",
      permisosRequeridos:["system","superusuario"],
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleHabilitarParametro(params.row.idParametro)}>
          <CheckIcon />
        </IconButton>
      ),
    },
  ];

  const handleEditarParametro = (idParametro) =>{
    setSelectedComponent(
      <EditarParametro
      idParametro={idParametro}
      setSelectedComponent={setSelectedComponent}
      auth={auth}
      ></EditarParametro>
    )
  }

  const handleClickOpen = () => {
    setSelectedComponent(<AgregarParametro       setSelectedComponent={setSelectedComponent}
      auth={auth} ></AgregarParametro>)
    //setOpen(true);
  };


  useEffect(() => {
    fetchParametros(true);
    
  }, [fetchParametros]);
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
    <Provider store={store}>
      <Grid container padding={2}>
        {renderModals()}

        <Grid item xs={12}>
          <HeaderContent titulo="Lista de parámetros"></HeaderContent>
          <Paper style={{ padding: 20 }}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={8}
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  
                }}
              >
              
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Activos" value={1} />
                  <Tab label="Deshabilitados" value={0} />
                </Tabs>
              


            </Grid>           
            <UsuarioAutorizado
                  usuario={auth}
                  permisosRequeridos={["system","superusuario"]}
                >
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >     
                <Typography variant="h6">Agregar parámetro nuevo</Typography>
                <IconButton
                  variant={"contained"}
                  sx={{
                    borderRadius: "50%",
                    backgroundColor: "green",
                    color: "white",
                    marginLeft: "10px",
                  }}
                  onClick={handleClickOpen}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              </UsuarioAutorizado>
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={1}
                  direction="row"
                  justifyContent="flex-start"
                >
                  {isLoading && ( // Agrega el loader condicionalmente
                    <Grid item xs={12} align="center">
                      <CircularProgress size={50} />
                    </Grid>
                  )}
                  {parametros.length > 0 && (
                    <Grid item xs={12} >
                      <DataGrid
                        sx={{ maxHeight: "calc(100vh - 330px)", width: "100%" }}
                        rows={transformarDatos(parametros)}
                        columns={activeTab === 1 ? filtrarColumnasPorPermisos(columnsActivas,auth) : filtrarColumnasPorPermisos(columnsDeshabilitadas,auth)}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 10,
                            },
                          },
                        }}
                        pageSizeOptions={[10]}
                        checkGridSelection
                        disableRowSelectionOnClick
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Button sx={{mt:2}}
      variant="contained"
      color="success" 
      onClick={() => setSelectedComponent(<Home></Home>)}
      startIcon={<ArrowBackIcon />} 
    >
      Salir
    </Button>            
          </Paper>
        </Grid>

      </Grid>

    </Provider>
  );
}
export default ListaParametros;
