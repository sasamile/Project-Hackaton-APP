// types/navigation.ts
// types/navigation.ts
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      "/alert/[id]": {
        id: string;
      };
      "/": undefined;
      "/(tabs)": undefined;
      "/(auth)": undefined;
    }
  }
}

// No exports needed
export {};


export interface Alert2 {
  id: string;
  title: string;
  description: string;
  severity: "Baja" | "Media" | "Alta";
  affectedArea: [number, number];
  affectedAreaRadius: number;
  entityId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  entity?: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean | null;
    password: string;
    image: string | null;
    role: string;
    entityId: string;
    createdAt: string;
    updatedAt: string;
  };
}