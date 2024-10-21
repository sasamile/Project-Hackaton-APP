import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import tw from "twrnc";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { router } from "expo-router";

// Definición de la interfaz de Alert
interface Alert {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  entity: {
    name: string;
  };
}

// Definición de la interfaz de EntityButton
interface EntityButton {
  name: string;
  id: string;
  icon: any;
}

// Definición de los botones de entidad
const ENTITY_BUTTONS: EntityButton[] = [
  {
    name: "Policía",
    id: "cm2drnz10000033rx7y6udhbl",
    icon: require("../../assets/images/caso1.png"),
  },
  {
    name: "Bomberos",
    id: "cm2drnz11000133rxqj3kadn6",
    icon: require("../../assets/images/caso2.png"),
  },
  {
    name: "Oficina de Gestión de Riesgos",
    id: "cm2droiv7000233rxs8gqmafz",
    icon: require("../../assets/images/caso3.png"),
  },
];

// Componente principal HomeScreen
export default function HomeScreen() {
  const [getAlert, setGetAlert] = useState<Alert[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = (id: string) => {
    //@ts-ignore
    router.push(`/alert/${id}`);
  };

  // Función para buscar alertas por entidad
  const fetchAlertsByEntity = async (entityId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://safe-alert-system.vercel.app/api/alerts/entity/${entityId}`
      );
      setGetAlert(response.data);
      setSelectedEntity(entityId);
    } catch (error) {
      console.error("Error fetching entity alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar todas las alertas
  const loadAllAlerts = async () => {
    // Aquí podrías implementar la lógica para cargar todas las alertas
    setGetAlert([]); // Solo un ejemplo, puedes reemplazarlo con tu lógica
    setSelectedEntity(null);
  };

  // Componente para los botones de entidad
  const EntityButtons = () => (
    <View style={tw`flex-row justify-between mb-4 px-2`}>
      {ENTITY_BUTTONS.map((entity) => (
        <TouchableOpacity
          key={entity.id}
          style={[
            tw`items-center p-2 rounded-xl`,
            {
              backgroundColor:
                selectedEntity === entity.id ? "#FF5733" : "#333333",
              width: "30%",
            },
          ]}
          onPress={() => fetchAlertsByEntity(entity.id)}
        >
          <Image
            source={entity.icon}
            style={tw`w-12 h-12 mb-2`}
            resizeMode="contain"
          />
          <Text
            style={tw`text-white text-center text-xs font-medium`}
            numberOfLines={2}
          >
            {entity.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Renderizar cada alerta
  const renderItem = ({ item }: { item: Alert }) => {
    const maxTitleLength = 30;
    const maxDescriptionLength = 100;

    const truncatedTitle =
      item.title.length > maxTitleLength
        ? item.title.substring(0, maxTitleLength) + "..."
        : item.title;

    const truncatedDescription =
      item.description.length > maxDescriptionLength
        ? item.description.substring(0, maxDescriptionLength) + "..."
        : item.description;

    return (
      <View style={tw`bg-gray-800 p-4 rounded-xl mb-4`}>
        <Text style={tw`text-lg text-white font-bold`} numberOfLines={1}>
          {truncatedTitle}
        </Text>
        <Text style={tw`text-gray-400 mb-4`} numberOfLines={2}>
          {truncatedDescription}
        </Text>
        <View style={tw`flex-row justify-between items-center`}>
          <TouchableOpacity
            style={tw`bg-orange-500 rounded-xl px-4 py-2`}
            onPress={() => handlePress(item.id)}
          >
            <Text style={tw`text-white font-semibold`}>Saber más</Text>
          </TouchableOpacity>
          <Text style={tw`text-gray-500 text-xs`}>
            Creado{" "}
            {formatDistanceToNow(new Date(item.createdAt), {
              addSuffix: true,
              locale: es,
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`bg-black flex-1 p-4 mt-12`}>
      <EntityButtons />
      {isLoading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-white text-lg`}>Cargando...</Text>
        </View>
      ) : (
        <FlatList
          data={getAlert}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={isLoading}
          onRefresh={
            selectedEntity
              ? () => fetchAlertsByEntity(selectedEntity)
              : loadAllAlerts
          }
        />
      )}
    </View>
  );
}
