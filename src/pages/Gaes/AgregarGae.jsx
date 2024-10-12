import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import HeaderContent from '../HeaderContent';
import ListaGaes from './ListaGaes';
import ModalGenerico from '../../components/ModalGenerico';
import { useGaeService } from '../../hooks/useGaeServices';
import LoadingComponent from '../LoadingComponent';
import { handleOnChangeInputTextoNumero } from '../../utils';

const AgregarGae = ({ setSelectedComponent, onResponse,auth }) => {
  const { isLoading, estaActivoModalOk, respuestaModalOk, handleCrearGae, cerrarModalOk } = useGaeService(onResponse);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => handleCrearGae({...data, estatus:true});

  const handleOnCLickSalir = () => setSelectedComponent(<ListaGaes
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
          <Typography>Id GAE</Typography>
          <TextField
            {...register('idGaeInterno', { required: true })}
            fullWidth
            placeholder="id GAE"
            variant="outlined"
            error={errors.idGaeInterno}
            helperText={errors.idGaeInterno && "Este campo es requerido"}
            onChange={handleOnChangeInputTextoNumero}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Nombre GAE</Typography>
          <TextField
            {...register('nombre', { required: true })}
            fullWidth
            placeholder="Nombre GAE"
            variant="outlined"
            error={errors.nombre}
            helperText={errors.nombre && "Este campo es requerido"}
            onChange={handleOnChangeInputTextoNumero}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Código GAE</Typography>
          <TextField
            {...register('codigo', { required: true })}
            fullWidth
            placeholder="Código GAE"
            variant="outlined"
            error={errors.codigo}
            helperText={errors.codigo && "Este campo es requerido"}
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
        <HeaderContent titulo="Agregar GAE" />
        <Paper style={{ padding: 20 }}>
          {renderForm()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AgregarGae;
