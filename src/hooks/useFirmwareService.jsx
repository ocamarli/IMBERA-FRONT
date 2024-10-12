import { useState, useCallback } from "react";
import { crearFirmware, obtenerFirmwares, actualizarFirmware, obtenerFirmware } from "../api/firmwaresApi";

export const useFirmwareService = () => {
  const [firmwares, setFirmwares] = useState([]);
  const [firmware, setFirmware] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [idFirmwareSeleccionado, setIdFirmwareSeleccionado] = useState("");
  const [estaActivoModalOk, setEstaActivoModalOk] = useState(false);
  const [respuestaModalOk, setRespuestaModalOk] = useState({ msg: "¡firmware deshabilitado!", status: true });
  const [estaActivoModalConfirmacionHabilitar, setEstaActivoModalConfirmacionHabilitar] = useState(false);
  const [respuestaModalConfirmacionHabilitar, setRespuestaModalConfirmacionHabilitar] = useState({
    msg: "¡Confirma para habilitar firmware!",
    status: false,
  });
  const [estaActivoModalConfirmacionDeshabilitar, setEstaActivoModalConfirmacionDeshabilitar] = useState(false);
  const [respuestaModalConfirmacionDeshabilitar, setRespuestaModalConfirmacionDeshabilitar] = useState({
    msg: "¡Confirma para deshabilitar firmware!",
    status: false,
  });
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    fetchFirmwares(Boolean(newValue));
  };

  const fetchFirmwares = useCallback(async (estatus) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const json = await obtenerFirmwares(tkn, estatus);
        setFirmwares(json.firmwares || []);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  const fetchFirmware = useCallback(async (idFirmware) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const json = await obtenerFirmware(tkn, idFirmware);
        setFirmware(json.firmware || []);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  const handleCrearFirmware = async (data) => {
    try {
      setIsLoading(true);
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (tkn) {
        const response = await crearFirmware(data, tkn);
        setRespuestaModalOk({ msg: response.msg, status: response.status });
        setEstaActivoModalOk(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleEditarFirmware = async (data) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const response = await actualizarFirmware(data, tkn);
      setRespuestaModalOk({ msg: response.msg, status: response.status });
      setEstaActivoModalOk(true);
    } catch (error) {
      console.error(error);
    }
  };

  const deshabilitarFirmware = async (idFirmware) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const data = { idFirmware, estatus: false };
      const response = await actualizarFirmware(data, tkn);
      if (response.status) {
        setRespuestaModalOk({ msg: "¡Firmware deshabilitado exitosamente!", status: true });
        setEstaActivoModalOk(true);
        fetchFirmwares(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const habilitarFirmware = async (idFirmware) => {
    try {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      const data = { idFirmware, estatus: true };
      const response = await actualizarFirmware(data, tkn);
      if (response.status) {
        setRespuestaModalOk({ msg: "¡Firmware habilitado exitosamente!", status: true });
        setEstaActivoModalOk(true);
        fetchFirmwares(false);
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
      habilitarFirmware(idFirmwareSeleccionado);
    }
    setEstaActivoModalConfirmacionHabilitar(false);
  };

  const cerrarModalConfirmacionDeshabilitar = (respuestaSeleccionada) => {
    if (respuestaSeleccionada) {
      deshabilitarFirmware(idFirmwareSeleccionado);
    }
    setEstaActivoModalConfirmacionDeshabilitar(false);
  };

  const handleDeshabilitarFirmware = (idFirmware) => {
    setIdFirmwareSeleccionado(idFirmware);
    setEstaActivoModalConfirmacionDeshabilitar(true);
  };

  const handleHabilitarFirmware = (idFirmware) => {
    setIdFirmwareSeleccionado(idFirmware);
    setEstaActivoModalConfirmacionHabilitar(true);
  };

  return {
    activeTab,
    firmwares,
    firmware,
    isLoading,
    idFirmwareSeleccionado,
    estaActivoModalOk,
    respuestaModalOk,
    handleTabChange,
    fetchFirmwares,
    fetchFirmware,
    handleCrearFirmware,
    handleEditarFirmware,
    handleDeshabilitarFirmware,
    handleHabilitarFirmware,
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