import React, { useState, useEffect, useCallback } from "react";
import { Typography, Grid, Paper,Box } from "@mui/material";
import ItemParametroCodigo from "./ItemParametroCodigo";
import { obtenerParametros } from "../../api/parametrosApi";
const ListaParametrosCodigo = (props) => {
  const {matches}=props
  console.log("matches",matches)
  const [parametros, setParametros] = useState([]);
  const fetchParametros = useCallback(async () => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      console.log(tkn);
      if (tkn !== undefined) {
        const json = await obtenerParametros(tkn);
        console.log(json);
        setParametros(json.parametros || []);
      } else {
        setParametros([]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [setParametros]);

  useEffect(() => {
    fetchParametros();
  }, [fetchParametros]);


  return (
    <Grid container direction="row">

      <Grid item xs={12} padding={0}>
        <Paper  variant="outlined" sx={{ padding: "15px" }}>
          <Grid container justifyContent="flex-start">
            <Typography fontSize={"1.2em"} sx={{}}>
              Parámetros
            </Typography>

            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              spacing={2}
              sx={{ padding: 2 }}
            >
              {parametros.map((item) => (

                <Box key={item.idParametroInterno} >
                  <ItemParametroCodigo
                    word={item.idParametroInterno}
                    nombre={item.nombre}
                    isEnable={matches.includes(item.idParametroInterno)}
                  />

                </Box>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ListaParametrosCodigo;
