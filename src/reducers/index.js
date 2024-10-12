const initialState = {
    recetas: [],
    parametros: [],
    opciones: []
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADD_RECETA":
        return {
          ...state,
          recetas: [
            ...state.recetas,
            {
              nombre: action.payload.nombre,
              fecha: action.payload.fecha
            }
          ]
        };
      case "ADD_PARAMETRO":
        return {
          ...state,
          parametros: [
            ...state.parametros,
            {
              nombre: action.payload.nombre,
              descripcion: action.payload.descripcion,
              recetaId: action.payload.recetaId
            }
          ]
        };
      case "ADD_OPCION":
        return {
          ...state,
          opciones: [
            ...state.opciones,
            {
              valor: action.payload.valor,
              parametroId: action.payload.parametroId
            }
          ]
        };
      case "REMOVE_RECETA":
        return {
          ...state,
          recetas: state.recetas.filter(receta => receta.id !== action.payload)
        };
      case "REMOVE_PARAMETRO":
        return {
          ...state,
          parametros: state.parametros.filter(parametro => parametro.id !== action.payload)
        };
      case "REMOVE_OPCION":
        return {
          ...state,
          opciones: state.opciones.filter(opcion => opcion.id !== action.payload)
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  