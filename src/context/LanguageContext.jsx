import React, { useState, useEffect } from 'react';
import apiService from '../service/api';
import { LanguageContext } from '../hooks/useLanguage';

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [translations, setTranslations] = useState({});
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSupportedLanguages();
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    changeLanguage(savedLang, false);
  }, []);

  const loadSupportedLanguages = async () => {
    try {
      const data = await apiService.getSupportedLanguages();
      
      if (data.returncode === "200") {
        setSupportedLanguages(data.languages);
      }
    } catch (error) {
      console.error('Failed to load supported languages:', error);
    }
  };

  const changeLanguage = async (lang, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const data = await apiService.changeLanguage(lang);
      
      if (data.returncode === "200") {
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