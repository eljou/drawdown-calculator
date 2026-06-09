export default function InputNumber(props: {
	id: string;
	label: string;
	placeholder: string;
	step?: number;
	min?: number;
	max: number;
	value: number;
	onValueChange: (newValue: number) => void;
	after?: "currency" | "lots" | "none";
	styles?: React.CSSProperties;
	mb?: number;
}) {
	return (
		<div
			className="form-group"
			style={props.mb !== undefined ? { marginBottom: 0 } : {}}
		>
			<label htmlFor={props.id}>{props.label}</label>
			<div
				className={`input-wrapper ${props.after ?? ""}`}
				style={{ minWidth: 160, ...props.styles }}
			>
				<input
					type="number"
					id={props.id}
					placeholder={props.placeholder}
					step={props.step ?? 10}
					min={props.min ?? 0}
					max={props.max}
					value={props.value}
					onChange={(e) => props.onValueChange(Number(e.target.value))}
				/>
			</div>
		</div>
	);
}
