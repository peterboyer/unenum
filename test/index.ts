import type { Enum } from "unenum";
import { safely } from "unenum";

type WebEvent = Enum<{
	// Unit
	PageLoad: undefined;
	PageUnload: undefined;
	// Tuple (use object: not feasible)
	KeyPress: { key: string };
	Paste: { content: string };
	// Object
	Click: { x: number; y: number };
}>;

function getWebEvent(): WebEvent | Enum<{ None: undefined }> {
	if ("".toString()) return { is: "PageLoad" };
	if ("".toString()) return { is: "PageUnload" };
	if ("".toString()) return { is: "KeyPress", key: "x" };
	if ("".toString()) return { is: "Paste", content: "..." };
	if ("".toString()) return { is: "Click", x: 10, y: 10 };
	return { is: "None" };
}

function inspect(): string | undefined {
	const event = getWebEvent();
	if (event.is === "PageLoad") console.log(event);
	else if (event.is === "PageUnload") console.log(event);
	else if (event.is === "KeyPress") console.log(event, event.key);
	else if (event.is === "Paste") console.log(event, event.content);
	else if (event.is === "Click") console.log(event, event.x, event.y);
	return "foo";
}

function app() {
	const $inspect = safely(() => inspect());
	if ($inspect.is === "Err") {
		return console.log($inspect.error);
	}
	return console.log($inspect.value);
}

() => app();
