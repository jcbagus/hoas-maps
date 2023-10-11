import React from 'react';

// import styles
import './Checkbox.scss';

export type CheckboxProps = React.ComponentPropsWithoutRef<'input'> & {
  id: string;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  label?: string | React.ReactNode;
  value?: string;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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
    }: CheckboxProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classNames = ['checkbox'];
    if (className) {
      classNames.push(className);
    }
    return (
      <div className={classNames.join(' ')} style={style}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className="checkbox__input"
          value={value}
          onChange={onChange}
          disabled={disabled}
          checked={checked}
          {...rest}
        />
        <label htmlFor={id} className="checkbox__label">
          {label}
        </label>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
