import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import HeaderContent from '../HeaderContent';
import ListaHardwares from '../Hardwares/ListaHardwares'
import ModalGenerico from '../../components/ModalGenerico';
import { useHardwareService } from '../../hooks/useHardwareService';
import LoadingComponent from '../LoadingComponent';
import { handleOnChangeInputTextoNumero} from '../../utils';

const AgregarHardware = ({ setSelectedComponent, onResponse, auth }) => {
  const { isLoading, estaActivoModalOk, respuestaModalOk, handleCrearHardware, cerrarModalOk } = useHardwareService(onResponse);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => handleCrearHardware({...data, estatus:true});
  const handleOnCLickSalir = () => setSelectedComponent(<ListaHardwares
    onResponse={onResponse}
    auth={auth}
    setSelectedComponent={setSelectedComponent} />);

  if (isLoading) {
    return <LoadingComponent />;
  }

  const renderModal = () => (
    <ModalGenerico
      tipoModal={respuestaModalOk.status}
      open={estaActivoModalOk}
      onClose={cerrarModalOk}
      title={respuestaModalOk.status ? "Correcto" : "Advertencia"}
      message={respuestaModalOk.msg}
      autoCierre={true}
    />
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography>Id hardware</Typography>
          <TextField
            {...register('idHardwareInterno', { required: true })}
            fullWidth
            placeholder="id hardware"
            variant="outlined"
            error={errors.idHardwareInterno}
            helperText={errors.idHardwareInterno && "Este campo es requerido"}
            onChange={handleOnChangeInputTextoNumero}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Nombre hardware</Typography>
          <TextField
            {...register('nombre', { required: true })}
            fullWidth
            placeholder="Nombre hardware"
            variant="outlined"
            error={errors.nombre}
            helperText={errors.nombre && "Este campo es requerido"}
            onChange={handleOnChangeInputTextoNumero}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container sx={{ justifyContent: 'space-around' }} spacing={2}>
            <Grid item xs={6}>
              <Button variant="contained" type="submit" sx={{ height: '50px' }} fullWidth>
                Agregar
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button color="error" variant="contained" sx={{ height: '50px' }} fullWidth onClick={handleOnCLickSalir}>
                Salir
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <Grid container padding={2} justifyContent={"center"}>
      {renderModal()}
      <Grid item xs={7}>
        <HeaderContent titulo="Agregar hardware" />
        <Paper style={{ padding: 20 }}>
          {renderForm()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AgregarHardware;
