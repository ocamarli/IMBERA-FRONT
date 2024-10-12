import { postData, getData } from "./axios";
import { ENV } from "../endpoints";

// Función para actualizar un usuario
export async function actualizarUsuario(data, token) {
  try {
    const response = await postData(ENV.actualizarUsuario(), data, token);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "Could not set parameters" };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}

// Función para obtener todos los usuarios
export async function obtenerUsuarios(token, estatus = null) {
  try {
    let url = ENV.obtenerUsuarios();
    if (estatus !== null) {
      url += `?estatus=${estatus}`;
    }
    const response = await getData(url, token);

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        usuarios: [],
        status: false,
        msg: "No se pudo obtener la información de los usuarios",
      };
    }
  } catch (error) {
    return { usuarios: [], status: false, msg: error.message };
  }
}

// Función para obtener un usuario por su ID
export async function obtenerUsuario(token, idUsuario) {
  try {
    const response = await getData(ENV.obtenerUsuario(idUsuario), token);

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        usuarios: [],
        status: false,
        msg: "No se pudo obtener la información del usuario",
      };
    }
  } catch (error) {
    return { usuarios: [], status: false, msg: error.message };
  }
}

// Función para actualizar el estado de un usuario
export async function actualizarEstatusUsuario(data, token) {
  try {
    const response = await postData(ENV.actualizarEstatusUsuario(), data, token);

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        usuarios: [],
        status: false,
        msg: "No se pudo actualizar el estado del usuario",
      };
    }
  } catch (error) {
    return { usuarios: [], status: false, msg: error.message };
  }
}

// Función para autenticar un usuario
export async function authenticate(data) {
  try {
    const response = await postData(ENV.login(), data);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "No se encontró información" };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}

// Función para crear un nuevo usuario
export async function crearUsuario(data, token) {
  try {
    const response = await postData(ENV.crearUsuario(), data, token);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "No se pudo crear el usuario" };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}