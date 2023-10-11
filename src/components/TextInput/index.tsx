import React from 'react';

// import styles
import './TextInput.scss';

type TextInputProps = React.ComponentPropsWithoutRef<'input'> & {
  id: string;
  className?: string;
  disabled?: boolean;
  label?: string | React.ReactNode;
  value?: string;
  required?: boolean;
  helperText?: string;
};

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      className,
      disabled = false,
      label,
      value,
      type = 'text',
      required,
      onChange = () => null,
      style,
      helperText,
      ...rest
    }: TextInputProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classNames = ['test-input'];
    if (className) {
      classNames.push(className);
    }

    const labelElement = label ? (
      <label htmlFor={id} className="text-input__label">
        {label}
      </label>
    ) : null;

    const helperTextElement = helperText ? (
      <span className="text-input__helptext">{helperText}</span>
    ) : null;

    return (
      <div className="text-input">
        {labelElement}
        <div className="text-input__input-wrapper">
          <input
            style={style}
            ref={ref}
            id={id}
            className="text-input__input"
            type={type}
            placeholder="Placeholder"
            disabled={disabled}
            value={value}
            onChange={onChange}
            required={required}
            {...rest}
          />
        </div>
        {helperTextElement}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
