import React from "react";

const UsuarioAutorizado = ({ usuario, permisosRequeridos, children }) => {
  // Verifica si el usuario tiene al menos uno de los permisos requeridos
  const tienePermiso = permisosRequeridos.some(permiso => usuario.permisos[permiso]);
  return tienePermiso ? <>{children}</> : <></> ;
};

export default UsuarioAutorizado;