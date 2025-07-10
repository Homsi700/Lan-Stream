
"use client";
import { useAppContext } from '@/context/app-context';
import { translations } from '@/lib/i18n';

// Helper type to get nested object keys
type NestedKeyOf<ObjectType extends object> = 
{[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object 
? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
: `${Key}`
}[keyof ObjectType & (string | number)];

type TranslationKeys = NestedKeyOf<(typeof translations)['en']>;

export function useTranslation() {
  const { language, setLanguage } = useAppContext();

  const t = (key: TranslationKeys): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // Fallback to English if key not found in current language
        result = translations.en;
        for (const k_en of keys) {
             if (result && typeof result === 'object' && k_en in result) {
                result = result[k_en];
            } else {
                return key; // Return the key if not found in English either
            }
        }
        break;
      }
    }
    return typeof result === 'string' ? result : key;
  };

  return { t, language, setLanguage };
}
