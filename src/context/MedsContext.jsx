import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const MedsContext = createContext(null);

export function MedsProvider({ children }) {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [consultations, setConsultations] = useState([]);

  const refreshConsultations = useCallback(async () => {
    const d = await api.listConsultations();
    setConsultations(d.consultations);
  }, []);

  // Load this user's data when they sign in; clear it when they sign out.
  useEffect(() => {
    if (!user) {
      setMedications([]);
      setConsultations([]);
      return;
    }
    api.listMedications().then((d) => setMedications(d.medications)).catch(() => {});
    refreshConsultations().catch(() => {});
  }, [user, refreshConsultations]);

  const addMedication = async (med) => {
    const d = await api.addMedication(med);
    setMedications((prev) => [d.medication, ...prev]);
  };

  return (
    <MedsContext.Provider value={{ medications, consultations, addMedication, refreshConsultations }}>
      {children}
    </MedsContext.Provider>
  );
}

export const useMeds = () => useContext(MedsContext);
