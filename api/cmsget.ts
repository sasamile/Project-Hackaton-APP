import { Alert } from "@/app/(tabs)/home";
import { Alert2 } from "@/types/navigation";
import axios from "axios";

export const GetAlert = async (): Promise<Alert[]> => {
  const response = await axios.get<Alert[]>(
    "https://safe-alert-system.vercel.app/api/alerts"
  );
  return response.data; // Devuelve los datos de la respuesta
};


export const GetAlertOne = async (id: string): Promise<Alert> => {
  try {
    const response = await axios.get<Alert | Alert[]>(`https://safe-alert-system.vercel.app/api/alerts/${id}`);

    // Verifica si la respuesta es HTML en lugar de JSON
    if (response.headers['content-type'] === 'text/html') {
      console.error("The response is HTML, possibly redirected to login.");
      throw new Error("Redirected to login page. Please check your authentication.");
    }

    // Verifica si la respuesta es un array
    if (Array.isArray(response.data)) {
      return response.data[0]; // Devuelve el primer objeto del array
    } else {
      return response.data; // Si no es un array, devuelve el objeto
    }
  } catch (error) {
    console.error("Error fetching alert:", error);
    throw error; // Lanzar el error para que pueda ser manejado
  }
};