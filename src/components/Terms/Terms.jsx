import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import apiService from '../../service/api';
import './Terms.css';

const Terms = () => {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { translate, currentLang } = useLanguage();

  useEffect(() => {
    fetchTerms();
  }, [currentLang]);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getTerms();
      
      if (result.returncode === "200") {
        setTerms(result.terms);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Failed to fetch terms:', err);
      setError(translate('login.error_server'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="terms-container">
        <div className="terms-card loading-card">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !terms) {
    return (
      <></>
    );
  }

  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1 className="terms-title">{currentLang === 'en' ? 'Terms' : 'Allmänna'}</h1>
        <button className="terms-back-button" onClick={() => window.history.back()}>{translate("terms.closeAndGoBack")}</button>
      </div>
      <div className="terms-card">
        <div className="terms-content">
          <p className="intro">{terms.introduction}</p>

          <section>
            <h2>{currentLang === 'en' ? 'Our Services' : 'Våra Tjänster'}</h2>
            <p>{terms.services}</p>
          </section>

          <section>
            <h2>{currentLang === 'en' ? 'User Responsibilities' : 'Användaransvar'}</h2>
            <p>{terms.user_responsibilities}</p>
          </section>

          <section>
            <h2>{currentLang === 'en' ? 'Payments' : 'Betalningar'}</h2>
            <p>{terms.payments}</p>
          </section>

          <section>
            <h2>{currentLang === 'en' ? 'Liability' : 'Ansvar'}</h2>
            <p>{terms.liability}</p>
          </section>

          <section>
            <h2>{currentLang === 'en' ? 'Termination' : 'Uppsägning'}</h2>
            <p>{terms.termination}</p>
          </section>

          <section>
            <h2>{currentLang === 'en' ? 'Changes to Terms' : 'Ändringar av Villkor'}</h2>
            <p>{terms.changes}</p>
          </section>

          <section>
            <h2>{currentLang === 'en' ? 'Contact Us' : 'Kontakta Oss'}</h2>
            <p>{terms.contact} <a href="mailto:support@123fakturera.se" className="contact-link">support@123fakturera.se</a></p>
          </section>
        </div>
      </div>
      <button className="terms-back-button last-button" onClick={() => window.history.back()}>{translate("terms.closeAndGoBack")}</button>
    </div>
  );
};

export default Terms;