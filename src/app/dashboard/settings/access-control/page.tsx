import AccessControlForm from "@/components/access-control-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, ShieldCheck } from "lucide-react";

export default function AccessControlPage() {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">Access Management</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Control which devices can access the video stream via the MikroTik integration.
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
                            <CardTitle>MikroTik Integration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                This interface allows you to manage access rules that can be applied to your MikroTik router. Approved IP and MAC addresses will be allowed to connect to the video streaming service.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-green-600">
                                <ShieldCheck className="h-5 w-5" />
                                <span className="font-semibold text-sm">Status: Connected & Active</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
