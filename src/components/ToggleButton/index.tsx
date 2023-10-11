import React from 'react';

import './ToggleButton.scss';

export type ToggleButtonProps = {
  id: string;
  label?: string | React.ReactNode;
  checked: boolean;
  className?: string;
  disabled?: boolean;
  onChange: (_boolean: boolean) => void;
};

export const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps
>(
  (
    { id, label, checked, className, disabled, onChange }: ToggleButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) => {
    const labelId = `${id}-label`;

    const classNames = ['toggle-button'];
    if (className) {
      classNames.push(className);
    }

    return (
      <div className={classNames.join(' ')}>
        {label && (
          <div className="toggle-button__label-container">
            <label id={labelId} htmlFor={id} className="toggle-button__label">
              {label}
            </label>
          </div>
        )}
        <button
          id={id}
          ref={ref}
          disabled={disabled}
          type="button"
          aria-pressed={checked}
          aria-labelledby={labelId}
          className="toggle-button__button"
          data-checked={checked}
          onClick={() => {
            onChange(!checked);
          }}
        >
          <span className="toggle-button__thumb" data-checked={checked} />
        </button>
      </div>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';
