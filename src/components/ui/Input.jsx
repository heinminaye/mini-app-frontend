import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage.js';

const InputField = ({
  label = '',
  type = 'text',
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  disabled = false,
  showPasswordToggle = false,
  error = '',
  translateError = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const { translate } = useLanguage();
  const [token, setToken] = useState(null);

  const togglePassword = () => setShowPassword(prev => !prev);
  const displayError = translateError && error ? translate(error) : error;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleInputChange = (e) => {
    let val = e.target.value;
    if (type === 'number') {
      if (/^\d*\.?\d*$/.test(val) || val === '') {
        onChange(e);
      }
    } else {
      onChange(e);
    }
  };
  return (
    <div className="input-group"  style={{
        marginBottom: token ? '0' : '20px',
      }}>
      {label && <label htmlFor={name}>{label}</label>}

      <div style={{ position: 'relative' }}>
        <input
          type={isPassword && showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          className={error ? 'input-error' : ''}
          style={{ 
            paddingRight: isPassword && showPasswordToggle ? '40px' : '10px',
            borderColor: error ? '#dc2626' : '#c7c7c7'
          }}
          {...rest}
        />

        {isPassword && showPasswordToggle && (
          <span
            onClick={togglePassword}
            style={{
              position: 'absolute',
              right: '10px',
              top: '54%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
          </span>
        )}
      </div>

      {displayError && <div className="field-error">{displayError}</div>}
    </div>
  );
};

export default InputField;