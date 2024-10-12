import { useState, useCallback } from "react";
import { crearHardware, obtenerHardwares, actualizarHardware, obtenerHardware } from "../api/hardwaresApi";

export const useHardwareService = () => {
  const [hardwares, setHardwares] = useState([]);
  const [hardware, setHardware] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [idHardwareSeleccionado, setIdHardwareSeleccionado] = useState("");
  const [estaActivoModalOk, setEstaActivoModalOk] = useState(false);
  const [respuestaModalOk, setRespuestaModalOk] = useState({ msg: "¡hardware deshabilitado!", status: true });
  const [estaActivoModalConfirmacionHabilitar, setEstaActivoModalConfirmacionHabilitar] = useState(false);
  const [respuestaModalConfirmacionHabilitar, setRespuestaModalConfirmacionHabilitar] = useState({
    msg: "¡Confirma para habilitar hardware!",
    status: false,
  });
  const [estaActivoModalConfirmacionDeshabilitar, setEstaActivoModalConfirmacionDeshabilitar] = useState(false);
  const [respuestaModalConfirmacionDeshabilitar, setRespuestaModalConfirmacionDeshabilitar] = useState({
    msg: "¡Confirma para deshabilitar hardware!",
    status: false,
  });
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    fetchHardwares(Boolean(newValue));
  };

  const fetchHardwares = useCallback(async (estatus) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const json = await obtenerHardwares(tkn, estatus);
        setHardwares(json.hardwares || []);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  const fetchHardware = useCallback(async (idHardware) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const json = await obtenerHardware(tkn, idHardware);
        setHardware(json.hardware || []);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  const handleCrearHardware = async (data) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const response = await crearHardware(data, tkn);
        setRespuestaModalOk({ msg: response.msg, status: response.status });
        setEstaActivoModalOk(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleEditarHardware = async (data) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const response = await actualizarHardware(data, tkn);
      setRespuestaModalOk({ msg: response.msg, status: response.status });
      setEstaActivoModalOk(true);
    } catch (error) {
      console.error(error);
    }
  };

  const deshabilitarHardware = async (idHardware) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const data = { idHardware, estatus: false };
      const response = await actualizarHardware(data, tkn);
      if (response.status) {
        setRespuestaModalOk({ msg: "¡Hardware deshabilitado exitosamente!", status: true });
        setEstaActivoModalOk(true);
        fetchHardwares(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const habilitarHardware = async (idHardware) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const data = { idHardware, estatus: true };
      const response = await actualizarHardware(data, tkn);
      if (response.status) {
        setRespuestaModalOk({ msg: "¡Hardware habilitado exitosamente!", status: true });
        setEstaActivoModalOk(true);
        fetchHardwares(false);
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
      habilitarHardware(idHardwareSeleccionado);
    }
    setEstaActivoModalConfirmacionHabilitar(false);
  };

  const cerrarModalConfirmacionDeshabilitar = (respuestaSeleccionada) => {
    if (respuestaSeleccionada) {
      deshabilitarHardware(idHardwareSeleccionado);
    }
    setEstaActivoModalConfirmacionDeshabilitar(false);
  };

  const handleDeshabilitarHardware = (idHardware) => {
    setIdHardwareSeleccionado(idHardware);
    setEstaActivoModalConfirmacionDeshabilitar(true);
  };

  const handleHabilitarHardware = (idHardware) => {
    setIdHardwareSeleccionado(idHardware);
    setEstaActivoModalConfirmacionHabilitar(true);
  };

  return {
    activeTab,
    hardwares,
    hardware,
    isLoading,
    idHardwareSeleccionado,
    estaActivoModalOk,
    respuestaModalOk,
    handleTabChange,
    fetchHardwares,
    fetchHardware,
    handleCrearHardware,
    handleEditarHardware,
    handleDeshabilitarHardware,
    handleHabilitarHardware,
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