import { useState } from "react";
import "./accordeon.css";

export default function Accordion({
	headContent,
	defaultOpen = false,
	children,
}: {
	defaultOpen?: boolean;
	headContent: string | ((isOpen: boolean) => React.ReactNode);
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const toggleAccordion = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="accordion-wrapper">
			<button
				type="button"
				className="accordion-header"
				onClick={toggleAccordion}
				aria-expanded={isOpen}
			>
				{typeof headContent === "string" ? (
					<>
						<span className="accordion-title">{headContent}</span>
						<span className={`accordion-icon ${isOpen ? "open" : ""}`}>
							{isOpen ? "▲" : "▼"}
						</span>
					</>
				) : (
					headContent(isOpen)
				)}
			</button>

			<div className={`accordion-content ${isOpen ? "open" : ""}`}>
				<div className="accordion-body">{children}</div>
			</div>
		</div>
	);
}
