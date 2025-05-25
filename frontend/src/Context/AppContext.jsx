import React, { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "../components/Snackbar";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [selectedVideo, setSelectedVideo] = useState(null);
  

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });

    setTimeout(() => {
      setSnackbar({ open: false, message: "", severity: "info" });
    }, 3000);
  }, []);

  const contextValue = {
    showSnackbar,
    selectedVideo,
    setSelectedVideo
    
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      {snackbar.open && <Snackbar {...snackbar} />}
    </AppContext.Provider>
  );
};

export default AppProvider;
