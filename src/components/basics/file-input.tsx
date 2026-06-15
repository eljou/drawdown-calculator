import { useRef, useState } from "react";
import "./file-input.css";

export default function FileInput(props: { onCsvDataParse: (text: string) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger click on hidden classic file element
  const handleZoneClick = () => {
    if (fileInputRef?.current) fileInputRef.current.click();
  };

  const processFile = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    setFileName(file.name);

    // Read file text directly
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result?.toString() ?? "";
      props.onCsvDataParse(text);
    };
    reader.readAsText(file);
  };

  // Drag event listeners
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      processFile(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    if (e.target.files) {
      processFile(e.target.files);
    }
  };

  return (
    <div
      className="card"
      style={{
        border: "1px solid var(--accent-primary)",
        boxShadow: "0 0 12px rgba(56, 189, 248, 0.1)",
      }}
    >
      <div className="label-row" style={{ alignItems: "flex-start" }}>
        <h2>Importación Masiva</h2>
        <span className="blue-pill">Recomendado</span>
      </div>

      <div
        className={`dropzone-container ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleZoneClick}
      >
        {/* Hidden HTML input native node */}
        <input
          ref={fileInputRef}
          type="file"
          id="enhancedCsvInput"
          accept=".csv"
          onChange={handleInputChange}
          style={{ display: "none" }}
        />

        <div className="dropzone-icon">{fileName ? "📄" : "📥"}</div>

        {fileName ? (
          <div>
            <p style={{ fontWeight: 600, color: "var(--accent-primary)" }}>Archivo Cargado con éxito</p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-main)",
                marginTop: "0.25rem",
                wordBreak: "break-all",
              }}
            >
              {fileName}
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontWeight: 600, textAlign: "justify" }}>
              Arrastra tu archivo CSV aquí o <span className="link">búscalo en tu equipo</span>
            </p>
            <p className="subtitle">Soporta bitácoras de Exness</p>
          </div>
        )}
      </div>
    </div>
  );
}
