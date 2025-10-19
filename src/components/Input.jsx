import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const togglePassword = () => setShowPassword(prev => !prev);

  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}

      <div style={{ position: 'relative' }}>
        <input
          type={isPassword && showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
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
              color: '#6b7280'
            }}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        )}
      </div>

      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default InputField;