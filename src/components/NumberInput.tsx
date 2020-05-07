import React, { FormEvent } from 'react';
import './NumberInput.css';

interface NumberInputProps {
  min?: string;
  max?: string;
  step?: string;
  title?: string;
  name?: string;
  onChange?: (ev: FormEvent<HTMLInputElement>) => void;
  defaultValue?: number;
}

const DEFAULT_PROPS: NumberInputProps = {
  min: '1',
  step: '1',
  defaultValue: 0,
};

function NumberInput(props: NumberInputProps = DEFAULT_PROPS) {
  const {
    title
  } = props;

  return (
    <div className="NumberInput-Container">
      {title && <label className="NumberInput-Label">{title}</label>}
      <input className="NumberInput-Input" type="number" {...props} />
    </div>
  );
}

export default NumberInput;