import React, { useState } from 'react';
import apiService from '../service/api';
import { LanguageContext } from '../hooks/useLanguage';

export const LanguageProvider = ({ children, initialData }) => {
  const [currentLang, setCurrentLang] = useState(initialData?.initialLanguage || 'en');
  const [translations, setTranslations] = useState(initialData?.translations || {});
  const [supportedLanguages] = useState(initialData?.supportedLanguages || []);
  const [loading, setLoading] = useState(false);

  const changeLanguage = async (lang, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const data = await apiService.changeLanguage(lang);
      
      if (data.returncode === "200" && data.translations) {
        setTranslations(data.translations);
        setCurrentLang(data.currentLanguage);
        localStorage.setItem('preferredLanguage', data.currentLanguage);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const translate = (key) => {
    return translations[key] || key;
  };

  const value = {
    currentLang,
    translations,
    supportedLanguages,
    loading,
    changeLanguage,
    translate
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};