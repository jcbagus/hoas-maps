import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import translations from './translations.json';

interface Translations {
  [key: string]: any;
}

interface IContextProps {
  translate: (_: string) => string;
  currentLanguage: string;
}

const TranslationContext = React.createContext<IContextProps>({
  translate: (text: string): string => text,
  currentLanguage: '',
});

const FALLBACK_LANGUAGE = 'fi';

function TranslationProvider({ children }: any) {
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState<string>(FALLBACK_LANGUAGE);
  const translate = useCallback(
    (text: string) =>
      (translations as Translations)[language || FALLBACK_LANGUAGE][text] ||
      text,
    [language],
  );

  const contextValue = React.useMemo(
    () => ({
      translate,
      currentLanguage: language,
    }),
    [language, translate],
  );

  useEffect(() => {
    const lang = searchParams.get('lang');
    if (lang && (translations as Translations)[lang.toLowerCase().trim()]) {
      setLanguage(lang.toLowerCase().trim());
    }
  }, [setLanguage, searchParams]);

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

const useTranslation = (): any => useContext(TranslationContext);

export { TranslationProvider, TranslationContext, useTranslation };
export default TranslationContext;
