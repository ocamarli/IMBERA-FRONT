import { useState, useCallback } from "react";
import { crearGae, obtenerGaes, actualizarGae, obtenerGae } from "../api/gaesApi";

export const useGaeService = () => {
  const [gaes, setGaes] = useState([]);
  const [gae, setGae] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [idGaeSeleccionado, setIdGaeSeleccionado] = useState("");
  const [estaActivoModalOk, setEstaActivoModalOk] = useState(false);
  const [respuestaModalOk, setRespuestaModalOk] = useState({ msg: "¡GAE deshabilitado!", status: true });
  const [estaActivoModalConfirmacionHabilitar, setEstaActivoModalConfirmacionHabilitar] = useState(false);
  const [respuestaModalConfirmacionHabilitar, setRespuestaModalConfirmacionHabilitar] = useState({
    msg: "¡Confirma para habilitar GAE!",
    status: false,
  });
  const [estaActivoModalConfirmacionDeshabilitar, setEstaActivoModalConfirmacionDeshabilitar] = useState(false);
  const [respuestaModalConfirmacionDeshabilitar, setRespuestaModalConfirmacionDeshabilitar] = useState({
    msg: "¡Confirma para deshabilitar GAE!",
    status: false,
  });
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    fetchGaes(Boolean(newValue));
  };

  const fetchGaes = useCallback(async (estatus) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const json = await obtenerGaes(tkn, estatus);
        setGaes(json.gaes || []);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  const fetchGae = useCallback(async (idGae) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const json = await obtenerGae(tkn, idGae);
        setGae(json.gae || []);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  const handleCrearGae = async (data) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const response = await crearGae(data, tkn);
        setRespuestaModalOk({ msg: response.msg, status: response.status });
        setEstaActivoModalOk(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleEditarGae = async (data) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const response = await actualizarGae(data, tkn);
      setRespuestaModalOk({ msg: response.msg, status: response.status });
      setEstaActivoModalOk(true);
    } catch (error) {
      console.error(error);
    }
  };

  const deshabilitarGae = async (idGae) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const data = { idGae, estatus: false };
      const response = await actualizarGae(data, tkn);
      if (response.status) {
        setRespuestaModalOk({ msg: "¡GAE deshabilitado exitosamente!", status: true });
        setEstaActivoModalOk(true);
        fetchGaes(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const habilitarGae = async (idGae) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const data = { idGae, estatus: true };
      const response = await actualizarGae(data, tkn);
      if (response.status) {
        setRespuestaModalOk({ msg: "¡GAE habilitado exitosamente!", status: true });
        setEstaActivoModalOk(true);
        fetchGaes(false);
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
      habilitarGae(idGaeSeleccionado);
    }
    setEstaActivoModalConfirmacionHabilitar(false);
  };

  const cerrarModalConfirmacionDeshabilitar = (respuestaSeleccionada) => {
    if (respuestaSeleccionada) {
      deshabilitarGae(idGaeSeleccionado);
    }
    setEstaActivoModalConfirmacionDeshabilitar(false);
  };

  const handleDeshabilitarGae = (idGae) => {
    setIdGaeSeleccionado(idGae);
    setEstaActivoModalConfirmacionDeshabilitar(true);
  };

  const handleHabilitarGae = (idGae) => {
    setIdGaeSeleccionado(idGae);
    setEstaActivoModalConfirmacionHabilitar(true);
  };

  return {
    activeTab,
    gaes,
    gae,
    isLoading,
    idGaeSeleccionado,
    estaActivoModalOk,
    respuestaModalOk,
    handleTabChange,
    fetchGaes,
    fetchGae,
    handleCrearGae,
    handleEditarGae,
    handleDeshabilitarGae,
    handleHabilitarGae,
    cerrarModalOk,
    cerrarModalConfirmacionHabilitar,
    estaActivoModalConfirmacionHabilitar,
    respuestaModalConfirmacionHabilitar,
    cerrarModalConfirmacionDeshabilitar,
    estaActivoModalConfirmacionDeshabilitar,
    respuestaModalConfirmacionDeshabilitar,
    setRespuestaModalConfirmacionHabilitar,
    setRespuestaModalConfirmacionDeshabilitar    
  };
};