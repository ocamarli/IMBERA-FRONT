
import Typography from "@mui/material/Typography";
import "../Plantillas/TemplateCss.css";
import { Grid, Paper, Modal } from "@mui/material";
import ListaParametrosCodigo from "./Componentes/ListaParametrosCodigo";
import InputCodigo from "../Codigos/InputCodigo";
import LoadingComponent from "../LoadingComponent";
import { usePlantillaService } from "../../hooks/usePlantillaService";
function EditarCodigo({ open, handleClose , onResponse}) {
  const {

    isLoading,
matches,setMatches } = usePlantillaService(onResponse);  

  if (isLoading  ) {
    return <LoadingComponent />;
  }
  return (
    <Modal open={open} onClose={handleClose} className="ap-modal">
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          width: "95vw",
          height: "95vh",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: "1.4em" }}>Config file.h</Typography>
          </Grid>
          <Grid item xs={12} style={{ maxHeight: "600px" }}>
            <>
            {console.log("matches",matches)}
            <ListaParametrosCodigo
              matches={matches}
              style={{ maxHeight: "500px" }}

            ></ListaParametrosCodigo>
            </>
          </Grid>
          <Grid item xs={12}>
            <InputCodigo
              setMatches={setMatches}
              onClose={handleClose}
              matches={matches}
              onResponse={onResponse}
            ></InputCodigo>
          </Grid>
          <Grid item xs={12} sx={{display:"flex", justifyContent:"end" }}>

          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
}
export default EditarCodigo;
