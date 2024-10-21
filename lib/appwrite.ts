import { Alert } from "react-native";
import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  PlatformId: "com.safe.alert",
  projectId: "6710883800021eb9fc11",
  databaseId: "67108c590024ce8ec0ae",
  userCollectionId: "67108c9000101682f54d",
  storageId: "67109491003b0cf135e3",
};

const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.PlatformId);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

interface CreateProps {
  email: string;
  password: string;
  username: string;
}

export const createUSer = async ({
  email,
  password,
  username,
}: CreateProps) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);
    console.log(email, password);

    const newUSer = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUSer;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export async function SignIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount(); // Obtiene la cuenta actual
    if (!currentAccount) return null; // Si no hay cuenta, retorna null

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) return null; // Si no hay usuario, retorna null

    return currentUser.documents[0]; // Devuelve el primer documento de usuario encontrado
  } catch (error) {
    console.log(error);
    return null; // Retorna null en caso de error
  }
}

// Sign Out
export async function logOut() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

// export const checkUserSession = async () => {
//   try {
//     const session = await account.get(); // Verifica si el usuario tiene una sesión activa
//     return !!session; // Devuelve true si hay sesión, false si no
//   } catch (error) {
//     console.error("No active session", error);
//     return false; // Devuelve false si no hay sesión
//   }
// };
