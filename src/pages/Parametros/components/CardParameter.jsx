import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useTheme,alpha,CardHeader } from "@mui/material";
function CardParameter(props) {
  const { parameter} = props;
  const theme=useTheme();
  // Obtener el color de fondo con transparencia según el modo del tema
  const backgroundColorWithOpacity = theme.palette.mode === 'light'
    ? alpha(theme.palette.primary.main, .7)// Para el modo oscuro, no se aplica transparencia
    :  null;
    const colorTextHeader = theme.palette.mode === 'light'
    ? alpha("#ffffff", .9)// Para el modo oscuro, no se aplica transparencia
    :  null;    
  return (
    <Card variant="outlined" style={{ justifyContent: "center", height:"100%" }}>
<CardHeader  titleTypographyProps={{ variant: 'h6'}} 
        sx={{color:colorTextHeader, padding:"5px",backgroundColor:backgroundColorWithOpacity, marginBottom:"-10px"}}
        title={parameter.name}/>      
      <CardContent >
        <Typography variant="body2" sx={{ margin: 0, display:"block" }}>{parameter.id_parameter}</Typography>
        <Typography variant="body2" sx={{ margin: 0, display:"block" }} color="text.secondary">{parameter.description}</Typography>
      </CardContent>
    </Card>
  );
}

export default CardParameter;
