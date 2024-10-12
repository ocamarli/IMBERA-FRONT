import React, { useCallback, useEffect } from "react";
import { Modal, Paper } from "@mui/material";
import { saveAs } from "file-saver";
import { usePlantillaService } from "../../hooks/usePlantillaService";
import LoadingComponent from "../LoadingComponent";

function obtenerParametrosProgramacion(plantilla, noProgramacion) {
  const programacion = plantilla.programaciones.find(
    (prog) => prog.noProgramacion === noProgramacion
  );
  return programacion ? programacion.parametros : [];
}

function ImprimirPlantilla(props) {
  const { idPlantilla, open, handleClose, onResponse } = props;

  const {
    isLoading,
    plantilla,
    fetchPlantilla,
    fetchCodigos,
    codigos,
  } = usePlantillaService(onResponse);

  useEffect(() => {
    fetchCodigos();
    fetchPlantilla(idPlantilla);
  }, [fetchCodigos, fetchPlantilla, idPlantilla]);

  const convertRecetasDefines = useCallback(() => {
    if (!plantilla) {
      console.log("No hay plantilla disponible para generar recetas");
      return "";
    }

    // Filtrar solo las programaciones habilitadas
    const programacionesHabilitadas = plantilla.programasHabilitados
      .map((noProgramacion) =>
        plantilla.programaciones.find((prog) => prog.noProgramacion === noProgramacion)
      )
      .filter((prog) => prog !== undefined);

    // Generar las definiciones #define con numeración secuencial
    const recetasDefines = programacionesHabilitadas
      .map((prog, index) => {
        const parametro10 = prog.parametros.find(
          (param) => param.idParametroInterno === "010"
        );
        const idReceta = parametro10 ? parametro10.valor : "0";

        const noProgramacionOriginal = prog.noProgramacion;

        const numeroSecuencial = index + 1;

        return `#define ID_RECETA_CONTENEDOR_${numeroSecuencial}\t\t${idReceta}
#define N_RECETA_CONTENEDOR_${numeroSecuencial}\t\t${noProgramacionOriginal}`;
      })
      .join('\n\n');

    return `${recetasDefines}`;
  }, [plantilla]);

  const convertTextProgramacion = useCallback(() => {
    if (!plantilla) {
      console.log("No hay plantilla disponible");
      return;
    }

    const resultadosCodigoProgramaciones = plantilla.programasHabilitados.map(
      (noProgramacion,index) => {
        const parametrosProgramacion = obtenerParametrosProgramacion(
          plantilla,
          noProgramacion
        );
        const parametrosCombinados = [
          ...plantilla.parametrosGenerales,
          ...parametrosProgramacion,
        ];

        const resultado = codigos[1]?.valor.replace(
          /\{(index|noProgramacion|idGae|\d+)\}/g,
          (match, idParametroInterno) => {
            console.log("match", match);
            if (match === "{index}") {
              return `${index+1}`;
            }
            if (match === "{noProgramacion}") {
              return `${noProgramacion}`;
            }
            if (match === "{idGae}") {
              return `${plantilla.gae}`;
            }
            const objetoEncontrado = parametrosCombinados.find(
              (obj) => obj.idParametroInterno === idParametroInterno
            );
            return objetoEncontrado ? objetoEncontrado.valor : match;
          }
        );

        return {
          noProgramacion,
          resultado,
        };
      }
    );

    console.log("Resultados de Programaciones", resultadosCodigoProgramaciones);

    // Generar y descargar un archivo para cada resultado de programación
    resultadosCodigoProgramaciones.forEach(({ resultado }, index) => {
      const blob = new Blob([resultado], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `contenedor${index+1}.h`);
    });
  }, [plantilla, codigos]);

  const convertTextGeneral = useCallback(() => {
    console.log("plantilla", plantilla);
    if (!plantilla) {
      console.log("No hay plantilla disponible");
      return;
    }

    // Generar las definiciones #define para {recetas} y NUMERO_PLANTILLAS_ACTIVAS
    const recetasDefines = convertRecetasDefines();

    const parametrosCombinados = [
      ...plantilla.parametrosGenerales,
      ...plantilla.programasHabilitados.flatMap((noProgramacion) =>
        obtenerParametrosProgramacion(plantilla, noProgramacion)
      ),
    ];

    const resultado = codigos[0]?.valor.replace(
      /\{recetas\}|\{plantillasActivas\}|\{(inicioSeleccionado|idPlantilla|idFirmware|\d+)\}/g,
      (match, p1) => {
        if (match === "{idFirmware}") {
          return plantilla.firmware;
        }
        if (match === "{recetas}") {
          return recetasDefines;
        }
        if (match === "{plantillasActivas}") {
          // Obtener el número de plantillas activas
          const numeroPlantillasActivas = plantilla.programasHabilitados.length;
          return numeroPlantillasActivas;
        }
        if (match === "{idPlantilla}") {
          return parseInt(plantilla.idPlantillaInterno, 10)
            .toString(16)
            .toUpperCase();
        }
        if (match === "{inicioSeleccionado}") {
          const index = plantilla.programasHabilitados.findIndex(
            programa => programa === plantilla.programaSeleccionado
          );
          return index+1;
        }
        // Manejar otros placeholders que sean solo números
        const objetoEncontrado = parametrosCombinados.find(
          (obj) => obj.idParametroInterno === p1
        );
        return objetoEncontrado ? objetoEncontrado.valor : match;
      }
    );

    console.log("Resultado General", resultado);

    // Generar y descargar el archivo de configuración general
    const blob = new Blob([resultado], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `configuracionGeneralDelEquipo.h`);
  }, [plantilla, codigos, convertRecetasDefines]);

  useEffect(() => {
    if (plantilla && codigos && open) {
      convertTextProgramacion(); // Descargar archivos para cada programación
      convertTextGeneral(); // Descargar archivo general solo una vez
      handleClose();
    }
  }, [plantilla, codigos, open, convertTextGeneral, convertTextProgramacion, handleClose]);

  if (isLoading || !codigos) {
    return (
      <Modal open={open} onClose={handleClose} className="ap-modal">
        <Paper
          elevation={3}
          spacing={0}
          sx={{
            height: "30%",
            width: "30%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          <h2>Generando archivos</h2>
          <LoadingComponent />
        </Paper>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} className="ap-modal">
      <Paper
        elevation={3}
        spacing={5}
        sx={{
          padding: 3,
          height: "30%",
          width: "30%",
        }}
      ></Paper>
    </Modal>
  );
}

export default ImprimirPlantilla;
