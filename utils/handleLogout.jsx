import { router } from "expo-router";
import { clearAuthToken } from "./AuthToken";
import { clearUserId } from "./saveUserID";

export default async function handleLogout() {
    await clearAuthToken();
    await clearUserId();
     router.replace('/(auth)/WhatsAppNumberInput');
}