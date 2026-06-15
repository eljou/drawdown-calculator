import RangeSlider from "../basics/range-slider";
import "./symbol-config.css";

type SymbolConfig = {
  ticker: string;
  currentPrice: number;
  longsStop: number;
  shortsStop: number;
  min: number;
  max: number;
  color: string;
};

export default function SymbolConfig({
  state,
  onChange,
  onRemove,
}: {
  state: SymbolConfig;
  onChange: (state: SymbolConfig) => void;
  onRemove: (ticker: string) => void;
}) {
  const { ticker, min, max, currentPrice, longsStop, shortsStop, color } = state;

  const handleUpdate = (field: "longsStop" | "shortsStop" | "currentPrice" | "color", value: number | string) => {
    let updatedValue = value;
    if (field === "longsStop") {
      updatedValue = Math.min(Number(value), currentPrice);
    } else if (field === "shortsStop") {
      updatedValue = Math.max(Number(value), currentPrice);
    }

    onChange({ ...state, [field]: updatedValue });
  };

  return (
    <div className="column-content">
      <div className="head">
        <h2>Configuración de:</h2>
        <span>{ticker.toUpperCase()}</span>
        <button
          type="button"
          className="btn-dimmed"
          style={{
            borderRadius: "50px",
            padding: "0px",
            margin: "0px",
            width: "35px",
            height: "35px",
          }}
          onClick={() => onRemove(ticker)}
        >
          <small>🗑️</small>
        </button>
      </div>
      <div className="form-group">
        <div className="label-row">
          <label htmlFor={`${ticker}-color`}>Label Color</label>
          <input
            id={`${ticker}-color`}
            type="color"
            value={color}
            onChange={(e) => handleUpdate("color", e.target.value)}
          />
        </div>
      </div>

      <RangeSlider
        label="Precio actual"
        limits={true}
        onValueChange={(value) => handleUpdate("currentPrice", value)}
        initialValue={currentPrice}
        min={min}
        max={max}
        step={100}
      />

      <div className="form-group longs-wrapper">
        <div className="label-row">
          <label htmlFor={`${ticker}-longStop`}>Stop Loss - COMPRAS (Longs)</label>
          <span className="slider-value-display text-green">${longsStop.toLocaleString()}</span>
        </div>
        <input
          type="range"
          id={`${ticker}-longStop-slider`}
          min="0"
          max={currentPrice}
          step="50"
          value={longsStop}
          onChange={(e) => handleUpdate("longsStop", Number(e.target.value))}
        />
        <div className="input-wrapper currency">
          <input
            type="number"
            id={`${ticker}-longStop`}
            style={{ paddingTop: "0.3rem", paddingBottom: "0.3rem" }}
            value={longsStop || ""}
            max={currentPrice}
            onChange={(e) => handleUpdate("longsStop", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="form-group shorts-wrapper">
        <div className="label-row">
          <label htmlFor={`${ticker}-shortStop`}>Stop Loss - VENTAS (Shorts)</label>
          <span className="slider-value-display text-red">${shortsStop.toLocaleString()}</span>
        </div>
        <input
          type="range"
          id={`${ticker}-shortStop-slider`}
          min={currentPrice}
          max={currentPrice * 2}
          step="50"
          value={shortsStop}
          onChange={(e) => handleUpdate("shortsStop", Number(e.target.value))}
        />
        <div className="input-wrapper currency">
          <input
            type="number"
            id={`${ticker}-shortStop`}
            style={{ paddingTop: "0.3rem", paddingBottom: "0.3rem" }}
            value={shortsStop || ""}
            min={currentPrice}
            onChange={(e) => handleUpdate("shortsStop", Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
