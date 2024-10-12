import React from "react";
import ImagenHome from "../../imagenes/ImberaLogo.png"
import { Grid } from "@mui/material";

const Home = (props) => {

  return (
    <Grid
      container
      padding={5}
      alignItems="center"
      justifyItems="center"
      justifyContent="center"
      mt={"20%"}
      
sx={{opacity:".7"}}
    >
            <img src={ImagenHome} alt="Logo" />
    </Grid>
  );
};

export default Home;
