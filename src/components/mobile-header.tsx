
"use client"

import { Clapperboard } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTranslation } from "@/hooks/use-translation"

export function MobileHeader() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
      <SidebarTrigger className="h-8 w-8" />
      <div className="flex items-center gap-2">
        <Clapperboard className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">{t('appName')}</span>
      </div>
    </header>
  )
}
