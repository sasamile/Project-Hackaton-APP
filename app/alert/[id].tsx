import { View, Text, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import tw from "twrnc";
import { useEffect, useState } from "react";
import { GetAlertOne } from "@/api/cmsget";
import { Alert2 } from "@/types/navigation";
import MapView, { Circle } from "react-native-maps"; // Importa Circle

const getEntityImage = (entityName: string) => {
  switch (entityName) {
    case "Oficina de Gestión de Riesgos":
      return require("../../assets/images/caso3.png");
    case "Bomberos":
      return require("../../assets/images/caso2.png");
    case "Policía":
      return require("../../assets/images/caso1.png");
    default:
      return require("../../assets/images/caso4.png");
  }
};

const getRecommendations = (entityName: string) => {
  switch (entityName) {
    case "Bomberos":
      return [
        "Llamar al 123 si se observa humo o fuego.",
        "Evitar acercarse al fuego.",
        "Mantener la calma y evacuar el área.",
      ];
    case "Policía":
      return [
        "Reportar cualquier actividad sospechosa al 112.",
        "Mantenerse alejado de situaciones peligrosas.",
        "Informar a las autoridades sobre incidentes.",
      ];
    case "Oficina de Gestión de Riesgos":
      return [
        "Seguir las instrucciones de las autoridades locales.",
        "Estar alerta a los avisos de emergencia.",
        "Preparar un kit de emergencia.",
      ];
    default:
      return [
        "Evitar caminar solo en áreas oscuras o poco transitadas.",
        "Estar atento a personas sospechosas en los alrededores.",
        "No llevar objetos de valor a la vista.",
      ];
  }
};

export default function AlertDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [getAlert, setGetAlert] = useState<Alert2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getOneAlert = async (alertId: string) => {
    try {
      setLoading(true);
      const data = await GetAlertOne(alertId);
      setGetAlert(data);
    } catch (err) {
      setError("Error al cargar la alerta");
      console.error("Error fetching alert:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getOneAlert(id);
    }
  }, [id]);

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black p-4`}>
        <Text style={tw`text-white text-xl`}>Cargando alerta...</Text>
      </View>
    );
  }

  if (error || !getAlert) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black p-4`}>
        <Text style={tw`text-white text-xl`}>
          {error || "No se pudo cargar la alerta"}
        </Text>
      </View>
    );
  }

  const entityName = getAlert.entity?.name || "Entidad desconocida";
  const entityImage = getEntityImage(entityName);
  const recommendations = getRecommendations(entityName);

  // Map severity to text color
  const severityTextColor =
    getAlert.severity === "Alta"
      ? tw`text-red-500`
      : getAlert.severity === "Media"
      ? tw`text-yellow-500`
      : tw`text-green-500`;

  // Format coordinates safely
  const formattedCoordinates = getAlert.affectedArea
    ? `${getAlert.affectedArea[0].toFixed(6)}, ${getAlert.affectedArea[1].toFixed(6)}`
    : "No disponible";

  return (
    <ScrollView style={[tw`flex-1 bg-black`,{overflow:"scroll"}]}>
      {/* Mapa sin margen y sin zoom */}
      <MapView
        style={tw`h-80 w-full`} // Define la altura del mapa y ocupa el ancho completo
        initialRegion={{
          latitude: getAlert.affectedArea[0],
          longitude: getAlert.affectedArea[1],
          latitudeDelta: 0.010, // Ajusta el zoom a un nivel más cercano
          longitudeDelta: 0.025, // Ajusta el zoom a un nivel más cercano
        }}
      >
        {/* Dibuja el círculo azul (área afectada) */}
        <Circle
          center={{
            latitude: getAlert.affectedArea[0],
            longitude: getAlert.affectedArea[1],
          }}
          radius={getAlert.affectedAreaRadius} // Radio del círculo
          fillColor={"rgba(0, 0, 255, 0.5)"} // Color de fondo (azul claro)
          strokeColor={"rgba(0, 0, 255, 1)"} // Color del borde (azul oscuro)
        />

        {/* Dibuja el círculo rojo (área de alerta) */}
        <Circle
          center={{
            latitude: getAlert.affectedArea[0],
            longitude: getAlert.affectedArea[1],
          }}
          radius={getAlert.affectedAreaRadius} // Radio del círculo
          fillColor={"rgba(255, 0, 0, 0.5)"} // Color de fondo (rojo claro)
          strokeColor={"rgba(255, 0, 0, 1)"} // Color del borde (rojo oscuro)
        />
      </MapView>

      {/* Título centrado y capitalizado */}
      <Text style={tw`text-white text-2xl p-6 font-bold  mt-4 mb-2`}>
        {getAlert.title.charAt(0).toUpperCase() + getAlert.title.slice(1)}
      </Text>

      {/* Descripción capitalizada y alineada a la izquierda */}
      <Text style={tw`text-white text-base mb-4 p-6`}>
        {getAlert.description.charAt(0).toUpperCase() + getAlert.description.slice(1)}
      </Text>
      <View style={tw`flex-row  px-8 items-center mb-4`}>
        <Image source={entityImage} style={tw`w-12 h-12`} />
        <Text style={[tw`ml-2`, severityTextColor]}>
          Severidad: {getAlert.severity}
        </Text>
      </View>

      <Text style={tw`text-white text-lg font-bold mb-2 p-6`}>
        Detalles adicionales
      </Text>
      <Text style={tw`text-gray-400 mb-2 p-6`}>
        Fecha: {new Date(getAlert.createdAt).toLocaleDateString()}
      </Text>
     
      <Text style={tw`text-white text-lg font-bold p-6 pb-12`}>Recomendaciones</Text>
      {recommendations.length > 0 ? (
        recommendations.map((rec, index) => (
          <Text key={index} style={tw`text-white mb-2 px-8 flex gap-4 `}>
            - {rec}
          </Text>
        ))
      ) : (
        <Text style={tw`text-white mb-20 p-6`}>No hay recomendaciones disponibles.</Text>
      )}
    </ScrollView>
  );
}
