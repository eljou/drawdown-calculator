import { useState } from "react";
import "./range-slider.css";

export default function RangeSlider(props: {
  initialValue: number;
  label: string;
  min: number;
  max: number;
  step: number;
  limits?: boolean;
  onValueChange: (value: number) => void;
}) {
  const [value, setValue] = useState(props.initialValue);

  return (
    <div className="form-group">
      <div className="label-row">
        <label htmlFor="precioFinal">{props.label}</label>
        <span id="sliderValue" className="slider-value-display">
          ${value.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        id="precioFinal"
        min={props.min}
        max={props.max}
        value={value}
        step={props.step}
        onChange={(e) => {
          setValue(Number(e.target.value));
          props.onValueChange(value);
        }}
      />
      {props.limits && (
        <div className="slider-limits">
          <span>${props.min}</span>
          <span>${props.max}</span>
        </div>
      )}
    </div>
  );
}
