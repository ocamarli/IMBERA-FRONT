import { postData,getData } from "./axios";
import { ENV } from "../endpoints";
// Función para actualizar un plantilla



export async function actualizarPlantilla(data, token) {
  try {
    const response = await postData(ENV.actualizarPlantilla(), data, token);
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "Error al actualizar plantilla" };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}
export async function obtenerCodigos(token) {
  try {
    const response = await getData(
      ENV.obtenerCodigos(),
      token
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      return {
        text:"",
        status: false,
        msg: "No pudo obtener información de los códigos",
      };
    }
  } catch (error) {
    return { text: "", status: false, msg: error.message};
  }
}


export async function actualizarCodigo(data, token) {
  try {
    // Verificar si se proporcionan los datos necesarios
    if (!data || !data.idCodigo) {
      throw new Error("El id del código es requerido para la actualización.");
    }

    const response = await postData(
      ENV.actualizarCodigo(),
      data,  
      token
    );

    if (response.status === 200) {
      const responseData = await response.json();
      if (responseData.status) {
        return responseData;
      } else {
        return {
          text: "",
          status: false,
          msg: responseData.msg || "No pudo obtener información de los códigos",
        };
      }
    } else {
      return {
        text: "",
        status: false,
        msg: "No pudo actualizar la información del código",
      };
    }
  } catch (error) {
    return {
      text: "",
      status: false,
      msg: error.message,
    };
  }
}
// Función para obtener todos los GAEs
export async function obtenerPlantillas(token, estatus = null) {
  try {
    let url = ENV.obtenerPlantillas();
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
        msg: "No se pudo obtener la información de las plantillas.",
      };
    }
  } catch (error) {
    return { firmwares: [], status: false, msg: error.message };
  }
}

  export async function obtenerPlantilla(token,idPlantilla) {
    try {
      const response = await getData(
        ENV.obtenerPlantilla(idPlantilla),
        token
      );
  
      if (response.status === 200) {
        return await response.json();
      } else {
        return {
          parameters: [],
          status: false,
          msg: "No se pudo obtener información de las plantillas."
        };
      }
    } catch (error) {
      return { parameters: [], status: false, msg: error.message};
    }
  }
  export async function verificarParametros(token,idPlantilla) {
    try {

      let url = ENV.verificarParametros();
      if (idPlantilla !== null) {
        url += `?idPlantilla=${idPlantilla}`;
      }
  
      const response = await getData(
       url,
        token
      );
  
      if (response.status === 200) {
        return await response.json();
      } else {
        return {
          parameters: [],
          status: false,
          msg: "No se pudo obtener información de las plantillas."
        };
      }
    } catch (error) {
      return { parameters: [], status: false, msg: error.message};
    }
  }  
  export async function crearPlantilla(data, token) {
    try {
      const response = await postData(
       ENV.crearPlantilla(),
        data,
        token
      );
      console.log(data)
      if (response.status === 200) {
        return await response.json();
      } else {
        return { status: false, msg: "No se pudo guardar la plantilla." };
      }
    } catch (error) {
      return { status: false, msg: error.message };
    }
  }
  export async function actualizarParametroPlantilla(data,token) {
    try {
      const response = await postData(
      ENV.actualizarParametroPlantilla(),
        {data},
        token
      );
  
      if (response.status === 200) {
        return await response.json();
      } else {
        return {
          parameters: [],
          status: false,
          msg: "Could not retrieve parameters",
        };
      }
    } catch (error) {
      return { parameters: [], status: false, msg: error.message};
    }
  }
  export async function clonarPlantilla(data,token) {
    try {
      const response = await postData(
      ENV.clonarPlantilla(),
        data,
        token
      );
  
      if (response.status === 200) {
        return await response.json();
      } else {
        return {
          status: false,
          msg: "No se puede realizar la copia de la plantilla",
        };
      }
    } catch (error) {
      return {  status: false, msg: error.message};
    }
  }
  
export async function setFileTemplate(data, token) {
  try {
    const response = await postData(ENV.setFileTemplate(), data, token);
    console.log("data")
    console.log(data)
    if (response.status === 200) {
      return await response.json();
    } else {
      return { status: false, msg: "Could not retrieve file data" };
    }
  } catch (error) {
    return { status: false, msg: error.message };
  }
}

