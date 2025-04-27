import { getCurrentUser } from "@/backend/services/authService";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const checkAuth = async (router: AppRouterInstance   , currentUrl: string) => {
    const user = await getCurrentUser();
    if (!user) {
        router.push(`/login?redirect=${currentUrl}`);
        return false;
    }
    else {
        return true;
    }
}