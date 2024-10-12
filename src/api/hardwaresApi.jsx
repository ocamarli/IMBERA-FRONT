import { postData, getData } from "./axios";
import { ENV } from "../endpoints";

// Función para actualizar un hardware
export async function actualizarHardware(data, token) {
  try {
    const response = await postData(ENV.actualizarHardware(), data, token);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "Error al actualizar hardware" };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}

// Función para obtener todos los GAEs
export async function obtenerHardwares(token, estatus = null) {
  try {
    let url = ENV.obtenerHardwares();
    if (estatus !== null) {
      url += `?estatus=${estatus}`;
    }

    const response = await getData(url, token);

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        hardwares: [],
        status: false,
        msg: "No se pudo obtener la información de los GAEs.",
      };
    }
  } catch (error) {
    return { hardwares: [], status: false, msg: error.message };
  }
}

// Función para obtener un hardware por su ID
export async function obtenerHardware(token, idHardware) {
  try {
    const response = await getData(ENV.obtenerHardware(idHardware), token);

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        hardware: [],
        status: false,
        msg: "No se pudo obtener la información de hardware",
      };
    }
  } catch (error) {
    return { hardware: [], status: false, msg: error.message };
  }
}

// Función para crear un nuevo hardware
export async function crearHardware(data, token) {
  try {
    const response = await postData(ENV.crearHardware(), data, token);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "Error al guardar hardware." };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}