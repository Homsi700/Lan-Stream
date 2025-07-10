
"use client";

import AccessControlForm from "@/components/access-control-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function AccessControlPage() {
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
                <Card>
                    <CardHeader>
                        <CardTitle>{t('userManagement.form.title')}</CardTitle>
                        <CardDescription>{t('userManagement.form.description')}</CardDescription>
                    </CardHeader>
                    <AccessControlForm />
                </Card>
            </div>
        </div>
    );
}
