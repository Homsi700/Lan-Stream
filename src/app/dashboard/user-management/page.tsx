
"use client";
import UserManagementForm from "@/components/user-management-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function UserManagementPage() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">{t('userManagement.title')}</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    {t('userManagement.subtitle')}
                </p>
            </header>
            <div className="max-w-4xl mx-auto">
               <UserManagementForm />
            </div>
        </div>
    );
}
