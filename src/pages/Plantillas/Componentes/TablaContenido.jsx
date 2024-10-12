import { TextField, FormControl, Grid,  Select, MenuItem, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, {  useEffect } from "react";

import { usePlantillaService } from "../../../hooks/usePlantillaService.jsx";
import LoadingComponent from "../../LoadingComponent.jsx";

import ModalGenerico from "../../../components/ModalGenerico.jsx";
const TablaContenido = ({ idPlantilla, checkboxSeleccionados, onResponse,estaCongelado}) => {
  const {fetchActualizarParametroPlantilla, 
    isLoading, plantilla, fetchPlantilla, 
    setEstaActivoModalOk,
    cerrarModalOk,
    estaActivoModalOk,
    respuestaModalOk,
    setRespuestaModalOk,
     } = usePlantillaService(onResponse);



  const handleOnBlur = (e, parametro) => {
    const nuevoValor = parseFloat(e.target.value);
    const idParametro = parametro.row.idParametro;
    const valorActual = parametro.row.valor;
    const valorMin = parseFloat(parametro.row.valor_min);
    const valorMax = parseFloat(parametro.row.valor_max);
    const tipoCampo = parametro.row.tipoCampo;
    let noProgramacion = parametro.row.noProgramacion;
    if(!noProgramacion){
      noProgramacion = 0
    }

    console.log("NV",nuevoValor)
    console.log("parametro",parametro)
    if (tipoCampo === "rango") {
      
      if (/^-?[0-9]*(\.[0-9]+)?$/.test(nuevoValor) ) {
        // Si cumple con el patrón o está vacío, actualizar el valor en el estado
        if (nuevoValor >= valorMin && nuevoValor <= valorMax) {
          console.log("ok");
          fetchActualizarParametroPlantilla(idPlantilla, idParametro, nuevoValor.toString(), noProgramacion,true);          
        } else {
          setRespuestaModalOk({ msg: "¡Valor no valido!", status: false });
          setEstaActivoModalOk(true);
          e.target.value = "";


        }
      } else {
        // Si no cumple con el patrón, restaurar el valor actual
        e.target.value = "";
      }
    }
    console.log("id:", idParametro);
    console.log("valor", valorActual);

  };

  const handleSelectChange = (e, idParametro, noProgramacion) => {
    let valor = e.target.value;
    console.log("handleSelectChange");
    console.log("valor", valor);
    console.log("idParametro", idParametro);
    if(!noProgramacion){
      noProgramacion=0;
    }
    // Llamar a la función actualizarParametroPlantilla() aquí
    fetchActualizarParametroPlantilla(idPlantilla, idParametro, valor, noProgramacion,true);
  };


  useEffect(() => {
    fetchPlantilla(idPlantilla);
  }, [fetchPlantilla,idPlantilla]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "idParametro", headerName: "ID parametro", flex: 0.5 },

    {
      field: "valor",   
      headerName: "Valor",
      flex: 1,
      editable: false,
      renderCell: (parametro) => {
        if (parametro.row.tipoCampo === "opciones") {
          return (
            <FormControl variant="outlined" size="small" fullWidth>
              <Select
                id={"select-param-" + parametro.row.idParametro}
                key={"select-param-" + parametro.row.idParametro}
                name={"select-param"}
                onChange={(e) =>
                  handleSelectChange(
                    e,
                    parametro.row.idParametro,
                    parametro.row.noProgramacion
                  )
                }
                size="small"
                defaultValue={
                  parametro.row.esValorFijo ? parametro.row.valorFijo : parametro.row.valor
                }
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Selecciona una opción</em>;
                  }
                  return selected;
                }}
                disabled={estaCongelado||parametro.row.esValorFijo}
              >
                <MenuItem disabled value="">
                  <em>Selecciona una opción</em>
                </MenuItem>
                {parametro.row.opciones.map((opcion) => (
                  <MenuItem key={opcion.valor} value={opcion.valor}>
                    {opcion.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        } else {
          return (
            <FormControl variant="outlined" size="small" fullWidth>
              <TextField
                type="text"
                id={"search-input-" + parametro.row.idParametro}
                onBlur={(e) => handleOnBlur(e, parametro)}

                disabled={estaCongelado||parametro.row.esValorFijo}
                defaultValue={
                  parametro.row.esValorFijo ? parametro.row.valorFijo : parametro.row.valor
                }
                pattern="-?[0-9]*(\.[0-9]+)?"
              />
            </FormControl>
          );
        }
      },
    },
    { field: "unidad", headerName: "Unidad", flex: 0.5 },    
    {
      field: "rango",
      headerName: "Rango",
      flex: 1,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 2,
    },
  ];

  function transformarDatos(parametros, noProgramacion) {
    return parametros.map((parametro,index) => {

      return {
        id:  index + 1 || "",
        idParametro:  parametro.idParametroInterno || "",
        valorFijo: parametro.valorFijo || "",
        valor: parametro.valor || "",
        esValorFijo: parametro.esValorFijo || "",
        descripcion: parametro.descripcion || "",
        tipoCampo: parametro.tipoCampo || "",
        tipoParametro: parametro.tipoParametro || "",
        unidad: parametro.unidad || "",
        valor_min: parametro.valor_min || "",
        valor_max: parametro.valor_max || "",
        opciones: parametro.opciones || [],
        rango: parametro.rango || "",
        noProgramacion: noProgramacion || "",
      };
    });
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
        msActiva={1000}
      />

    </>
  );
  if (isLoading || plantilla==null) {
    return <LoadingComponent />;
  }
  return (

        <Grid container>
          {renderModals()}
          <Grid item xs={12}>
            {plantilla.parametrosGenerales.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight={600}>
                  Parámetros Generales
                </Typography>
                <DataGrid
                  rows={transformarDatos(plantilla.parametrosGenerales, null)}
                  columns={columns}
                  pageSize={5}
                  rowHeight={30}
                />
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              {plantilla.programaciones
                .filter((programacion) =>
                  checkboxSeleccionados.includes(programacion.noProgramacion)
                )
                .map((programacion) => (
                  <Grid item key={parseInt(programacion.noProgramacion)} xs={12} spacing={1}>
                    <Typography variant="body1" fontWeight={600}>
                      Parámetros de programación {programacion.noProgramacion}
                    </Typography>
                    <DataGrid
                      key={parseInt(programacion.noProgramacion)}
                      rows={transformarDatos(
                        programacion.parametros,
                        parseInt(programacion.noProgramacion)
                      )}
                      columns={columns}
                      pageSize={5}
                      rowHeight={30}
                    />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
 
  );
};

export default TablaContenido;
