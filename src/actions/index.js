// Agregar un parámetro a una receta existente
export const addParam = (recipeName, paramName, paramOptions) => ({
    type: "ADD_PARAM",
    recipeName,
    paramName,
    paramOptions,
  });
  
  // Actualizar el valor de un parámetro de una receta existente
  export const updateParamValue = (recipeName, paramName, paramValue) => ({
    type: "UPDATE_PARAM_VALUE",
    recipeName,
    paramName,
    paramValue,
  });
  
  // Eliminar un parámetro de una receta existente
  export const deleteParam = (recipeName, paramName) => ({
    type: "DELETE_PARAM",
    recipeName,
    paramName,
  });
  
  // Agregar una nueva receta
  export const addRecipe = (recipeName) => ({
    type: "ADD_RECIPE",
    recipeName,
  });
  
  // Eliminar una receta existente
  export const deleteRecipe = (recipeName) => ({
    type: "DELETE_RECIPE",
    recipeName,
  });