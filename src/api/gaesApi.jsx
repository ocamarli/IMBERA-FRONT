import { postData, getData } from "./axios";
import { ENV } from "../endpoints";

// Función para actualizar un GAE
export async function actualizarGae(data, token) {
  try {
    const response = await postData(ENV.actualizarGae(), data, token);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "Error al actualizar GAE" };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}

// Función para obtener todos los GAEs
export async function obtenerGaes(token, estatus = null) {
  try {
    let url = ENV.obtenerGaes();
    if (estatus !== null) {
      url += `?estatus=${estatus}`;
    }

    const response = await getData(url, token);

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        gaes: [],
        status: false,
        msg: "No se pudo obtener la información de los GAEs.",
      };
    }
  } catch (error) {
    return { gaes: [], status: false, msg: error.message };
  }
}

// Función para obtener un GAE por su ID
export async function obtenerGae(token, idGae) {
  try {
    const response = await getData(ENV.obtenerGae(idGae), token);

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        gae: [],
        status: false,
        msg: "No se pudo obtener la información de GAE",
      };
    }
  } catch (error) {
    return { gae: [], status: false, msg: error.message };
  }
}

// Función para crear un nuevo GAE
export async function crearGae(data, token) {
  try {
    const response = await postData(ENV.crearGae(), data, token);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "Error al guardar GAE." };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}