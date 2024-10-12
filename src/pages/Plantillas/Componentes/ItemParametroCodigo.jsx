import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const ItemParametroCodigo = (props) => {
  const { name, word, isEnable } = props;
  const backgroundCard1 = "#3AAA35";
  console.log(isEnable);
  return (
    <Card
      variant="outlined"
      sx={{
        padding: "5px",
        textDecoration: isEnable ? "line-through" : "none",
      }}
    >
      <Typography
        component="span"
        sx={{
          fontSize: ".8em",
          textAlign: "left",
          textDecorationLine: "underline",
          color: backgroundCard1,
        }}
      >
        {word}
      </Typography>
      <Typography component="span" sx={{ fontSize: ".8em", textAlign: "left" }}>
        {" "}
        {"-"} {name}
      </Typography>
    </Card>
  );
};
export default ItemParametroCodigo;
