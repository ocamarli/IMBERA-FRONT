import React, { useState, useEffect, useCallback } from "react";
import { Typography, Grid, Paper,Box } from "@mui/material";
import { getParametersTemplate } from "../../api/axios";
import ItemParametroCodigo from "./ItemParametroCodigo";

const ParametrosCodigo = (props) => {
  const template=props.templateOrigin
  const matches=props.matches
  console.log("matches",matches)
  const [parameters, setParameters] = useState([]);
  const fetchParameters =useCallback(async () => {      
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      console.log(tkn);
      if (tkn !== undefined) {
        const json = await getParametersTemplate(template.id_template,tkn);
        console.log("JSON",JSON.parse(json.template));
        setParameters(JSON.parse(json.template).parameters);
        console.log(JSON.parse(json.template).parameters);

      }else{
        
      }
    } catch (error) {
      //onResponse({ status: false, msg: error });
      console.error(error);
    }
  },[template]);

  useEffect(() => {
    fetchParameters();
  }, [fetchParameters]);


  return (
    <Grid container direction="row">

      <Grid item xs={12} padding={0}>
        <Paper  variant="outlined" sx={{ padding: "15px" }}>
          <Grid container justifyContent="flex-start">
            <Typography fontSize={"1.2em"} sx={{}}>
              Parameters
            </Typography>

            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              spacing={2}
              sx={{ padding: 2 }}
            >
              {parameters.map((item) => (

                <Box key={item.name} >
                  {console.log(item)}
                  <ItemParametroCodigo
                    word={item.id_parameter}
                    name={item.name}
                    isEnable={matches.includes(item.id_parameter)}
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

export default ParametrosCodigo;
