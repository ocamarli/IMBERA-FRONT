import React, { useRef, useEffect, useState } from "react";
import { Button, Box, Grid, Divider } from "@mui/material";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useTheme } from "@mui/material";
import { usePlantillaService } from "../../../src/hooks/usePlantillaService";
import LoadingComponent from "../LoadingComponent";
import ModalGenerico from "../../components/ModalGenerico";


function InputCodigo(props) {
  const { onResponse, tipoCodigo } = props;
const {handleActualizarCodigo,respuestaModalOk,estaActivoModalOk,cerrarModalOk,} = usePlantillaService()
  const {
    isLoading,
    fetchCodigos,
    setCodigo: setCodigoService,
    codigos,
  } = usePlantillaService(onResponse);

  const [codigo, setCodigo] = useState("");
  const theme = useTheme();
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCodigos();
  }, [fetchCodigos]);

  useEffect(() => {
    if (codigos && Array.isArray(codigos)) {
      const codigoObj = codigos.find((item) => item.nombre === tipoCodigo);
      if (codigoObj) {
        setCodigo(codigoObj.valor);
      } else {
        setCodigo("");
      }
    }
  }, [codigos, tipoCodigo]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpdate = () => {
    console.log("actualizarrrr",tipoCodigo)
    console.log("codigooo",codigo)
    handleActualizarCodigo({"tipoCodigo":tipoCodigo,"codigo":codigo})
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setCodigoService([{ nombre: tipoCodigo, valor: content }]);
      setCodigo(content);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === "{" || event.key === "}") {
        if (typeof codigo === "string") {
          const regex = /\{(.+?)\}/g;
          const matches = codigo.match(regex);
          if (matches) {
            const foundValues = matches.map((match) =>
              match.substring(1, match.length - 1)
            );

            console.log(foundValues);
          } else {

          }
        }
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [codigo]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
      <ModalGenerico
      tipoModal={respuestaModalOk.status}
      open={estaActivoModalOk}
      onClose={cerrarModalOk}
      title={respuestaModalOk.status ? "Correcto" : "Advertencia"}
      message={respuestaModalOk.msg}
      autoCierre={true}
    />
        <>
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <textarea
            value={codigo}
            onChange={(event) => setCodigo(event.target.value)}
            style={{ display: "none" }}
          />
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "justifyContent",
            }}
            mt={1}
          >
            <Button variant="contained" onClick={handleButtonClick}>
              Subir Código base
            </Button>
          </Box>
        </>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid
        item
        xs={12}
        style={{ overflowY: "scroll", maxHeight: "500px", fontSize: ".6em" }}
      >
        <CodeEditor
          data-color-mode={theme.palette.mode}
          value={codigo}
          language="c"
          placeholder="code."
          onChange={(evn) => setCodigo(evn.target.value)}
          padding={5}
          style={{
            minWith: "100%",
            fontSize: 12,
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            backgroundColor:
              theme.palette.mode === "dark" ? "#121212" : "#f6f8fa",
          }}
        />
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          sx={{ marginTop: "3em" }}
          variant="contained"
          type="submit"
          onClick={handleUpdate}
        >
          SALVAR
        </Button>
      </Grid>
    </Grid>
  );
}

export default InputCodigo;