import React, { useEffect} from "react";
import { Typography, Grid, Paper,Box } from "@mui/material";
import ItemParametroCodigo from "./ItemParametroCodigo";
import { useParametroService } from "../../../hooks/useParametroService";
const ListaParametrosCodigo = ({matches, onResponse}) => {
  

  
      const {
        parametros,
      fetchParametros } = useParametroService(onResponse);      
  console.log("matches",matches)

  useEffect(() => {
    fetchParametros();
  }, [fetchParametros]);


  return (
    <Grid container direction="row">

      <Grid item xs={12} padding={0}>
        <Paper  variant="outlined" sx={{ padding: "15px" }}>
          <Grid container justifyContent="flex-start">
            <Typography fontSize={"1.2em"} sx={{}}>
              Parametros
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
