import { useState, useCallback } from "react";
import { crearParametro, obtenerParametros, actualizarParametro, obtenerParametro } from "../api/parametrosApi";
import { useForm } from 'react-hook-form';
export const useParametroService = () => {
  const [tipoCampo, setTipoCampo] = useState("");
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState([]);  
  const [parametros, setParametros] = useState([]);
  const [parametro, setParametro] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [idParametroSeleccionado, setIdParametroSeleccionado] = useState("");
  const [estaActivoModalOk, setEstaActivoModalOk] = useState(false);
  const [respuestaModalOk, setRespuestaModalOk] = useState({ msg: "¡parámetro deshabilitado!", status: true });
  const [estaActivoModalConfirmacionHabilitar, setEstaActivoModalConfirmacionHabilitar] = useState(false);
  const [respuestaModalConfirmacionHabilitar, setRespuestaModalConfirmacionHabilitar] = useState({
    msg: "¡Confirma para habilitar parámetro!",
    status: false,
  });
  const [estaActivoModalConfirmacionDeshabilitar, setEstaActivoModalConfirmacionDeshabilitar] = useState(false);
  const [respuestaModalConfirmacionDeshabilitar, setRespuestaModalConfirmacionDeshabilitar] = useState({
    msg: "¡Confirma para deshabilitar parámetro!",
    status: false,
  });
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (event, newValue) => {
    console.log(newValue)
    setActiveTab(newValue);
    fetchParametros(Boolean(newValue));
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    defaultValues: {

    }
  });
  const fetchParametros = useCallback(async (estatus) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const json = await obtenerParametros(tkn, estatus);
        setParametros(json.parametros || []);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  const fetchParametro = useCallback(async (idParametro) => {
    try {
  
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const json = await obtenerParametro(tkn, idParametro);


        setParametro(json.parametro || []);

      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  const handleCrearParametro = async (data) => {
    try {
      const newData={...data,estatus:true}
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const response = await crearParametro(newData, tkn);
        setRespuestaModalOk({ msg: response.msg, status: response.status });
        setEstaActivoModalOk(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleEditarParametro = async (data) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const response = await actualizarParametro(data, tkn);
      setRespuestaModalOk({ msg: response.msg, status: response.status });
      setEstaActivoModalOk(true);
    } catch (error) {
      console.error(error);
    }
  };

  const deshabilitarParametro = async (idParametro) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const data = { idParametro, estatus: false };
      const response = await actualizarParametro(data, tkn);
      if (response.status) {
        setRespuestaModalOk({ msg: "¡parámetro deshabilitado exitosamente!", status: true });
        setEstaActivoModalOk(true);
        fetchParametros(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const habilitarParametro = async (idParametro) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const data = { idParametro, estatus: true };
      const response = await actualizarParametro(data, tkn);
      if (response.status) {
        setRespuestaModalOk({ msg: "¡parámetro habilitado exitosamente!", status: true });
        setEstaActivoModalOk(true);
        fetchParametros(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cerrarModalOk = () => {
    setEstaActivoModalOk(false);
  };

  const cerrarModalConfirmacionHabilitar = (respuestaSeleccionada) => {
    if (respuestaSeleccionada) {
      habilitarParametro(idParametroSeleccionado);
    }
    setEstaActivoModalConfirmacionHabilitar(false);
  };

  const cerrarModalConfirmacionDeshabilitar = (respuestaSeleccionada) => {
    if (respuestaSeleccionada) {
      deshabilitarParametro(idParametroSeleccionado);
    }
    setEstaActivoModalConfirmacionDeshabilitar(false);
  };

  const handleDeshabilitarParametro = (idParametro) => {
    setIdParametroSeleccionado(idParametro);
    setEstaActivoModalConfirmacionDeshabilitar(true);
  };

  const handleHabilitarParametro = (idParametro) => {
    setIdParametroSeleccionado(idParametro);
    setEstaActivoModalConfirmacionHabilitar(true);
  };

  return {
    activeTab,
    parametros,
    parametro,
    isLoading,
    idParametroSeleccionado,
    estaActivoModalOk,
    respuestaModalOk,
    handleTabChange,
    fetchParametros,
    fetchParametro,
    handleCrearParametro,
    handleEditarParametro,
    handleDeshabilitarParametro,
    handleHabilitarParametro,
    cerrarModalOk,
    cerrarModalConfirmacionHabilitar,
    estaActivoModalConfirmacionHabilitar,
    respuestaModalConfirmacionHabilitar,
    cerrarModalConfirmacionDeshabilitar,
    estaActivoModalConfirmacionDeshabilitar,
    respuestaModalConfirmacionDeshabilitar,
    setRespuestaModalConfirmacionHabilitar,
    setRespuestaModalConfirmacionDeshabilitar,
    register,
    handleSubmit,
    errors,
    setValue,
    openOptions,
    options,
    setOpenOptions,
    setOptions,
    reset,
    tipoCampo,
    setTipoCampo,

  };
};