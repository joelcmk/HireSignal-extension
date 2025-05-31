// import { useState } from 'react';

import type { ChangeEventHandler } from 'react';
import './switch.css';

interface switchProps {
  isOn: boolean;
  onClick?: ChangeEventHandler<HTMLInputElement>;
  id: string;
}

const Switch = ({ isOn, onClick, id }: switchProps) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={onClick ?? undefined}
        className="react-switch-checkbox"
        id={id}
        type="checkbox"
      />
      <label
        style={{ background: isOn ? '#06D6A0' : '' }}
        className="react-switch-label"
        htmlFor={id}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;
