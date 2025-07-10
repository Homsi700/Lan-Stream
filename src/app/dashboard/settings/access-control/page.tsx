
"use client";
import AccessControlForm from "@/components/access-control-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function AccessControlPage() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">{t('accessControl.title')}</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    {t('accessControl.subtitle')}
                </p>
            </header>
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                   <AccessControlForm />
                </div>
                <div className="md:col-span-1">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                             <div className="p-3 bg-primary/10 rounded-lg">
                                <Network className="h-6 w-6 text-primary"/>
                            </div>
                            <CardTitle>{t('accessControl.integrationCard.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {t('accessControl.integrationCard.description')}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-green-600">
                                <ShieldCheck className="h-5 w-5" />
                                <span className="font-semibold text-sm">{t('accessControl.integrationCard.status')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
