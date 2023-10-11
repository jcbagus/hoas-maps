import React from 'react';

// import styles
import './RadioButton.scss';

export type RadioButtonProps = React.ComponentPropsWithoutRef<'input'> & {
  id: string;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  label?: string | React.ReactNode;
  value?: string;
};

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      id,
      checked,
      className,
      disabled = false,
      label,
      value,
      onChange = () => null,
      style,
      ...rest
    }: RadioButtonProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classNames = ['radio-button'];
    if (className) {
      classNames.push(className);
    }
    return (
      <div className={classNames.join(' ')} style={style}>
        <input
          ref={ref}
          type="radio"
          id={id}
          className="radio-button__input"
          value={value}
          onChange={onChange}
          disabled={disabled}
          checked={checked}
          {...rest}
        />
        <label htmlFor={id} className="radio-button__label">
          {label}
        </label>
      </div>
    );
  },
);

RadioButton.displayName = 'RadioButton';

export default RadioButton;
