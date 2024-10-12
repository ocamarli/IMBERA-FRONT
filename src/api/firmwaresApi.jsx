import { postData, getData } from "./axios";
import { ENV } from "../endpoints";

// Función para actualizar un firmware
export async function actualizarFirmware(data, token) {
  try {
    const response = await postData(ENV.actualizarFirmware(), data, token);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "Error al actualizar firmware" };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}

// Función para obtener todos los GAEs
export async function obtenerFirmwares(token, estatus = null) {
  try {
    let url = ENV.obtenerFirmwares();
    if (estatus !== null) {
      url += `?estatus=${estatus}`;
    }

    const response = await getData(url, token);

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        firmwares: [],
        status: false,
        msg: "No se pudo obtener la información de los GAEs.",
      };
    }
  } catch (error) {
    return { firmwares: [], status: false, msg: error.message };
  }
}

// Función para obtener un firmware por su ID
export async function obtenerFirmware(token, idFirmware) {
  try {
    const response = await getData(ENV.obtenerFirmware(idFirmware), token);

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        firmware: [],
        status: false,
        msg: "No se pudo obtener la información de firmware",
      };
    }
  } catch (error) {
    return { firmware: [], status: false, msg: error.message };
  }
}

// Función para crear un nuevo firmware
export async function crearFirmware(data, token) {
  try {
    const response = await postData(ENV.crearFirmware(), data, token);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "Error al guardar firmware." };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}