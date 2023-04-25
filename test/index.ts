import type { Enum } from "unenum";
import { safely, match } from "unenum";

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

function inspect(event: WebEvent): string | undefined {
	if (event.is === "PageLoad") console.log(event);
	else if (event.is === "PageUnload") console.log(event);
	else if (event.is === "KeyPress") console.log(event, event.key);
	else if (event.is === "Paste") console.log(event, event.content);
	else if (event.is === "Click") console.log(event, event.x, event.y);
	return "foo";
}

function getEventPageType(event: WebEvent): "load" | "unload" | undefined {
	return match.orUndefined(event, {
		PageLoad: () => "load" as const,
		PageUnload: () => "unload" as const,
	});
}

function app() {
	const event = getWebEvent();
	if (event.is === "None") {
		return;
	}

	const eventPageType = getEventPageType(event);
	console.log(eventPageType);

	const $inspect = safely(() => inspect(event));
	if ($inspect.is === "Error") {
		return console.log($inspect.error);
	}
	console.log();
	return console.log(event);
}

() => app();
