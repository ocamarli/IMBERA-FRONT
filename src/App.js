import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import MDrawer from "./pages/MDrawer.jsx";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { isExpired, decodeToken } from "react-jwt";
import { Box } from "@mui/material";
import AgregarUsuario from "./pages/Register/AgregarUsuario.jsx";
import AgregarPlantilla from "./pages/Plantillas/AgregarPlantilla.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const PageTypes = {
    MDrawer: 0,
    Test: 1,
    AgregarPlantilla: 2,
    AgregarUsuario: 3,
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    // Deshabilitar clic derecho
  {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // Detectar teclas de desarrollo
    const handleKeyDown = (event) => {
      if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

}
    return () => {

    };
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#143C64",
        light: "#436383",
        dark: "#0E2A46",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#28a745",
        light: "#53B86A",
        dark: "#1C7430",
        contrastText: "#ffffff",
      },
      gray: {
        50: "#f5f5f5",
        100: "#eeeeee",
        200: "#e0e0e0",
        300: "#bdbdbd",
        400: "#9e9e9e",
        500: "#757575",
        600: "#616161",
        700: "#424242",
        800: "#212121",
        900: "#121212",
      },
    },
  });

  const handleDarkModeChange = () => {
    setDarkMode(!darkMode);
  };

  const AuthRoute = () => {
    if (sessionStorage.getItem("ACCSSTKN") !== null) {
      const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
      if (!validateToken(tkn))
        return <Login onDarkModeChange={handleDarkModeChange} />;
      else return <Navigate to="/Menu" replace />;
    } else {
      return <Login onDarkModeChange={handleDarkModeChange} />;
    }
  };

  const ProtectedRoute = ({ type }) => {
    const tkn = JSON.parse(sessionStorage.getItem("ACCSSTKN"))?.access_token;
    if (tkn !== undefined) {
      if (!validateToken(tkn)) {
        return <Navigate to="/" replace />;
      }
      const decodedTkn = decodeToken(tkn);
      console.log(decodedTkn);

      return <FilterRoutes type={type} auth={JSON.parse(decodedTkn.sub)} />;
    } else return <Navigate to="/" replace />;
  };

  const FilterRoutes = ({ type, auth }) => {
    switch (type) {
      case 0:
        return <MDrawer onDarkModeChange={handleDarkModeChange} auth={auth} />;
      case 1:
        return <div></div>;
      case 2:
        return <AgregarPlantilla onDarkModeChange={handleDarkModeChange} auth={auth} />;
      case 3:
        return <AgregarUsuario onDarkModeChange={handleDarkModeChange} auth={auth} />;
      default:
        return <>HHH</>;
    }
  };

  const validateToken = (tkn) => {
    if (isExpired(tkn)) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        </Box>
      ) : (
        <BrowserRouter>
          <div className="App">
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
                <Route path="/" element={<AuthRoute />}></Route>
                <Route
                  path="/Menu"
                  element={<ProtectedRoute type={PageTypes.MDrawer} />}
                ></Route>
                <Route
                  path="/Test"
                  element={<ProtectedRoute type={PageTypes.Test} />}
                />
                <Route
                  path="/AgregarPlantilla"
                  element={<ProtectedRoute type={PageTypes.AgregarPlantilla} />}
                />
                <Route
                  path="/AgregarUsuario"
                  element={<ProtectedRoute type={PageTypes.AgregarUsuario} />}
                />
              </Routes>
            </ThemeProvider>
          </div>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
