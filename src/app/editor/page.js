"use client";

import Editor from "@/components/Editor";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLights } from "@/store/reducers/editor.reducer";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./Editor.module.css";
import AppTutorial from "./editor.tutorial";

const SeparatorsContainer = dynamic(() => import("@/components/SeparatorsContainer"), {
		ssr: false,
});
const Toolbar = dynamic(() => import("@/components/Toolbar"), {
	ssr: false,
});

export default function EditorPage() {
	// Buy me a coffee widget
	useEffect(() => {
		if (document.getElementById("bmc-script")) return;

		const script = document.createElement("script");
		const div = document.getElementById("supportByBMC");
		script.setAttribute("id", "bmc-script");
		script.setAttribute(
			"src",
			"https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js",
		);
		script.setAttribute("data-name", "BMC-Widget");
		script.setAttribute("data-cfasync", "false");
		script.setAttribute("data-id", "heyyczer");
		script.setAttribute("data-description", "Support me on Buy me a coffee!");
		script.setAttribute("data-message", "Would you like to support this project?");
		script.setAttribute("data-color", "#40DCA5");
		script.setAttribute("data-position", "Right");
		script.setAttribute("data-x_margin", "18");
		script.setAttribute("data-y_margin", "18");

		script.onload = () => {
			const evt = new Event("DOMContentLoaded", {
				bubbles: false,
				cancelable: false,
			});
			window.dispatchEvent(evt);
		};

		div.appendChild(script);
	}, []);

	const dispatch = useAppDispatch();
	const { lights } = useAppSelector((state) => state.editor);
	const settings = useAppSelector((state) => state.settings);

	useEffect(() => {
		const preventContextMenu = (e) => e.preventDefault();
		window.addEventListener("contextmenu", preventContextMenu);

		return () => {
			window.removeEventListener("contextmenu", preventContextMenu);
		};
	}, []);

	useEffect(() => {
		if (!settings.oneColorPerColumn.value) return;

		const newLights = { ...lights };

		const columnColors = [];
		for (const rowIndex in lights) {
			const row = lights[rowIndex];
			for (const index in row ?? []) {
				const item = row[index];
				if (!item) continue;

				if (!columnColors[index] && item.color !== "none") {
					columnColors[index] = item.color;
				}

				if (
					item.color !== "none" &&
					columnColors[index] &&
					columnColors[index] !== item.color
				) {
					newLights[rowIndex] = {
						...newLights[rowIndex],
						[index]: { ...item, color: columnColors[index] },
					};
				}
			}
		}

		if (JSON.stringify(newLights) !== JSON.stringify(lights)) {
			dispatch(updateLights(newLights));
		}
	}, [dispatch, settings.oneColorPerColumn.value, lights]);

	return (
		<DndProvider backend={HTML5Backend}>
			<SeparatorsContainer />
			<AppTutorial />

			<div className={`${styles.background} min-h-screen px-12 py-9`}>
				<div className="flex justify-between gap-x-6">
					<Editor />
					<Toolbar />
				</div>
			</div>

			<div id="supportByBMC" />
		</DndProvider>
	);
}
