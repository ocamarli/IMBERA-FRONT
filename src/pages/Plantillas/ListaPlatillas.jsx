import React, { useEffect, useState } from "react";
import { Button, Grid, Paper, IconButton, Typography,Tab,Tabs, Dialog,Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {Notes as NotesIcon, Visibility as VisibilityIcon, LockOpen as UnlockIcon, Check as CheckIcon,FileDownload as DownloadIcon, Add as AddIcon, ArrowBack as ArrowBackIcon, DeleteOutline as DeleteIcon, Edit as EditIcon, FileCopy as FileCopyIcon, Lock as LockIcon } from "@mui/icons-material";
import HeaderContent from "../HeaderContent";
import { usePlantillaService } from "../../hooks/usePlantillaService";
import AgregarPlantilla from "./AgregarPlantilla";
import EditarPlantilla from "./EditarPlantilla";
import ModalClonarPlantilla from "./Componentes/ModalClonarPlantila";
import ModalGenerico from "../../components/ModalGenerico";
import Home from "../Home/Home";
import LoadingComponent from "../LoadingComponent";
import UsuarioAutorizado from "../../components/UsuarioAutorizado";
import ImprimirPlantilla from "./ImprimirPlantilla";
import ModalListaNotas from "./Componentes/ModalListaNotas";
import { filtrarColumnasPorPermisos } from "../../utils";
import { useTheme } from "@mui/material/styles";

function transformarDatos(plantillas) {
  console.log(plantillas);
  return plantillas.map((plantilla, index) => {
    return {
      id: index + 1 || "",
      idPlantillaInterno: plantilla.idPlantillaInterno || "",
      nombrePlantilla: plantilla.nombrePlantilla || "",
      plantilla: plantilla.plantilla || "",
      firmware: plantilla.firmware || "",
      hardware: plantilla.hardware || "",
      gae: plantilla.gae || "",
      creadoPor: plantilla.creadoPor || "",
      idPlantilla: plantilla.idPlantilla || "",
      estaCongelado:plantilla.estaCongelado || "",
      
    };
  });
}
const ListaPlantillas = ( { setSelectedComponent, auth, onResponse }) => {
  console.log("auth",auth)
  const theme=useTheme()
  const {
    activeTab,
    handleTabChange,
    plantillas,
    isLoading,
    fetchPlantillas,
    handleDeshabilitarPlantilla,
    handleClonarPlantilla,
    handleCongelarPlantillaDesdeLista,
    cerrarModalOk,
    estaActivoModalOk,
    respuestaModalOk,
    setRespuestaModalOk,
    estaActivoModalConfirmacionHabilitar,
    respuestaModalConfirmacionHabilitar,
    cerrarModalConfirmacionHabilitar,
    estaActivoModalConfirmacionDeshabilitar,
    respuestaModalConfirmacionDeshabilitar,
    cerrarModalConfirmacionDeshabilitar,
    plantillaAClonar,
    estaActivoModalClonar,
    setEstaActivoModalClonar,
    setEstaActivoModalOk,
    handleImprimirPlantilla,
    abrirImprimirPlantilla,
    setAbrirImprimirPlantilla,
    idPlantillaSeleccionado,
    handleHabilitarPlantilla,
    abrirListaNotas,
    setAbrirListaNotas,
    handleAbrirListaNotas,
    notas
    
  } = usePlantillaService(onResponse);  

const [clonacionExitosa,setClonacionExitosa]= useState(false)
const handleCloseListaNotas = (props) => {
  setAbrirListaNotas(false);
};
  const manejarCerrarModal = () => {
    setEstaActivoModalClonar(false);
  };

  const handleCerrarImprimirPlantilla = (props) => {
    setAbrirImprimirPlantilla(false)
  };

  useEffect(() => {
    fetchPlantillas(true);
  }, [fetchPlantillas]);
  useEffect(() => {
    if(clonacionExitosa){
      console.log("clonacionExitosa")
    fetchPlantillas(true)}
  }, [clonacionExitosa, fetchPlantillas]);
  const handleEditarPlantilla = (idPlantilla) => {
    setSelectedComponent(
      <EditarPlantilla
        idPlantilla={idPlantilla}
        setSelectedComponent={setSelectedComponent}
        auth={auth}
        onResponse={onResponse}
      ></EditarPlantilla>
    );
    console.log("Editar plantilla con ID:", idPlantilla);
  };
  const handeleAgregarPlantilla = () => {
    setSelectedComponent(
      <AgregarPlantilla
        setSelectedComponent={setSelectedComponent}
        auth={auth}
        onResponse={onResponse}
      ></AgregarPlantilla>
    );
  };
  const handleCongelar = (idPlantilla) =>{
    const response=handleCongelarPlantillaDesdeLista(idPlantilla,true)
    if(!response){
      setSelectedComponent(<ListaPlantillas
        setSelectedComponent={setSelectedComponent}
        onResponse={onResponse}
        auth={auth}
      ></ListaPlantillas>
    )

    }
  }
  const handleDescongelar = (idPlantilla) =>{
    const response=handleCongelarPlantillaDesdeLista(idPlantilla,false)
    if(!response){
        setSelectedComponent(
        <ListaPlantillas
          setSelectedComponent={setSelectedComponent}
          onResponse={onResponse}
          auth={auth}
        ></ListaPlantillas>
      )
      

    }
  }

  const columnsActivas = [
    { field: "id", headerName: "ID" },
    { field: "idPlantillaInterno", headerName: "ID plantilla" },    
    { field: "nombrePlantilla", headerName: "Nombre" , width:250},
    { field: "firmware", headerName: "Firmware" },
    { field: "hardware", headerName: "Hardware" },
    { field: "gae", headerName: "GAE" },
    { field: "creadoPor", headerName: "Creado por" },

    {
      field: "clonar",
      headerName: "Clonar",
      permisosRequeridos:["system","superusuario","electrico","laboratorio"],
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <IconButton
        style={{ color: theme.palette.primary.light}}
        onClick={() => handleClonarPlantilla(params.row.idPlantilla)}>
          <FileCopyIcon />
        </IconButton>
        </Box>
      ),
    },
    {
      field: "editar",
      headerName: "Editar",
      permisosRequeridos:["system","superusuario","electrico","laboratorio"],
      renderCell: (params) => (
        <IconButton
        style={{ color:theme.palette.primary.light}}
        onClick={() => handleEditarPlantilla(params.row.idPlantilla)}>
         {params.row.estaCongelado ? <VisibilityIcon /> : <EditIcon />} 
        </IconButton>
      ),
    },
    {
      field: 'congelar',
      headerName: "Congelar/Descongelar",
      permisosRequeridos:["system","superusuario","electrico","laboratorio"],
      renderCell: (params) => (
        <Box justifyContent="center" alignItems="center">
        <IconButton
          style={{ color: theme.palette.primary.light}}
          onClick={() => params.row.estaCongelado
            ? handleDescongelar(params.row.idPlantilla)
            : handleCongelar(params.row.idPlantilla)
          }
        >
          {params.row.estaCongelado ? <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario"]}><LockIcon /></UsuarioAutorizado> :  <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario","laboratorio","electrico"]}><UnlockIcon /></UsuarioAutorizado> } 
        </IconButton>
</Box>
      ),
    },
    {
      field: "eliminar",
      headerName: "Deshabilitar",
      permisosRequeridos:["system","superusuario"],
      renderCell: (params) => (
        <IconButton 
        disabled={Boolean(params.row.estaCongelado)}
        style={{ color: params.row.estaCongelado ? 'grey' : theme.palette.primary.light}}
        onClick={() => handleDeshabilitarPlantilla(params.row.idPlantilla)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: "generarArchivos",
      headerName: "Descargar",

      renderCell: (params) => (
        <IconButton 
        disabled={!params.row.estaCongelado}
        style={{ color:!params.row.estaCongelado? 'grey' : theme.palette.primary.light}}

        onClick={() => handleImprimirPlantilla(params.row.idPlantilla)}>
          <DownloadIcon/>
        </IconButton>
      ),
    },  
    {
      field: "notas",
      headerName: "Notas",

      renderCell: (params) => (
        <IconButton 
        style={{ color:theme.palette.primary.light}}

        onClick={() => handleAbrirListaNotas(params.row.idPlantilla)}>
          <NotesIcon/>
        </IconButton>
      ),
    },        
  ];
  const columnsDeshabilitadas = [
    { field: "id", headerName: "ID" },
    { field: "nombrePlantilla", headerName: "Nombre",width:250 },
    { field: "firmware", headerName: "Firmware" },
    { field: "hardware", headerName: "Hardware" },
    { field: "gae", headerName: "gae" },
    { field: "creadoPor", headerName: "Creado por" },


    {
      field: "habilitar",
      headerName: "Habilitar",
      permisosRequeridos:["system","superusuario"],
      renderCell: (params) => (
        <IconButton onClick={() => handleHabilitarPlantilla(params.row.idPlantilla)}>
          <CheckIcon />
        </IconButton>
      ),
    },
 
  ];
  const renderModals = () => (
    <>
        <Dialog open={abrirImprimirPlantilla} onClose={handleCerrarImprimirPlantilla}>
          <ImprimirPlantilla
            open={abrirImprimirPlantilla}
            handleClose={handleCerrarImprimirPlantilla}
            onResponse={onResponse}
            idPlantilla={idPlantillaSeleccionado}
          ></ImprimirPlantilla>
        </Dialog>
        <Dialog open={abrirListaNotas} onClose={handleCloseListaNotas}>
          <ModalListaNotas
          notas={notas}
            open={abrirListaNotas}
            handleClose={handleCloseListaNotas}
            onResponse={onResponse}
          ></ModalListaNotas>
        </Dialog>   


      <ModalGenerico
        tipoModal={respuestaModalOk.status}
        open={estaActivoModalOk}
        onClose={cerrarModalOk}
        title={respuestaModalOk.status ? "Correcto" : "Advertencia"}
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
      <ModalClonarPlantilla
        plantillaAClonar={plantillaAClonar}
        setSelectedComponent={setSelectedComponent}
        auth={auth}
        activo={estaActivoModalClonar}
        autoCierre={false}
        onClose={manejarCerrarModal}
        onResponse={onResponse}
        setEstaActivoModalOk={setEstaActivoModalOk}
        setRespuestaModalOk={setRespuestaModalOk}
        setClonacionExitosa={setClonacionExitosa}
      />   
         
    </>
  );
  if (isLoading ) {
    return <LoadingComponent />;
  }
  return (
    <Grid container padding={2}>
        <Grid item xs={12}>
          {renderModals()}
          <HeaderContent titulo="Lista de plantillas"></HeaderContent>
          <Paper style={{ padding: 20 }}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={8}
                sx={{ display: "flex", justifyContent: "left" }}
              >
              
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Activas" value={1} />
                  <Tab label="Deshabilitadas" value={0} />
                </Tabs>
              
              </Grid>
              <UsuarioAutorizado usuario={auth} permisosRequeridos={["system","superusuario","electrico","laboratorio"]}>

              <Grid
                item
                xs={4}
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                }}
              >

                <Typography variant="h6">Agregar una plantilla</Typography>
                <IconButton
                  variant={"contained"}
                  sx={{
                    borderRadius: "50%",
                    backgroundColor: "green",
                    color: "white",
                    marginLeft: "10px",
                  }}
                  onClick={handeleAgregarPlantilla}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              </UsuarioAutorizado>   
              <Grid item xs={12}>
                <DataGrid
                  /*rows={activeTab === "activas" ? dataActivas : dataObsoletas}*/
                  sx={{ maxHeight: "calc(100vh - 330px)", width: "100%" }}
                  rows={transformarDatos(plantillas)}
                  columns={activeTab === 1 ? filtrarColumnasPorPermisos(columnsActivas,auth) : filtrarColumnasPorPermisos(columnsDeshabilitadas,auth)}
                  pageSize={50}
                  rowsPerPageOptions={[5, 10, 20]}
                />
              </Grid>

            </Grid>
            <Button
              sx={{ mt: 5 }}
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
  );
};

export default ListaPlantillas;
