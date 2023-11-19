import { Enum, type Async, Result } from "unenum";

type WebEvent = Enum<{
	PageLoad: true;
	PageUnload: true;
	KeyPress: { key: string };
	Paste: { content: string };
	Click: { x: number; y: number };
}>;

function getWebEvent(): WebEvent | Enum<{ None: true }> {
	if ("".toString()) return { _type: "PageLoad" };
	if ("".toString()) return { _type: "PageUnload" };
	if ("".toString()) return { _type: "KeyPress", key: "x" };
	if ("".toString()) return { _type: "Paste", content: "..." };
	if ("".toString()) return { _type: "Click", x: 10, y: 10 };
	return { _type: "None" };
}

function inspect(event: WebEvent): string | undefined {
	if (event._type === "PageLoad") console.log(event);
	else if (event._type === "PageUnload") console.log(event);
	else if (event._type === "KeyPress") console.log(event, event.key);
	else if (event._type === "Paste") console.log(event, event.content);
	else if (event._type === "Click") console.log(event, event.x, event.y);
	return "foo";
}

function getEventPageType(event: WebEvent): "load" | "unload" | undefined {
	return Enum.match(event, {
		PageLoad: () => "load" as const,
		PageUnload: () => "unload" as const,
		_: () => undefined,
	});
}

function useFutureResult(): Async.Enum<Result<string, "FooError">> {
	return { _type: "Pending" };
}

function app() {
	const result = useFutureResult();
	if (result._type === "Pending") {
		return;
	} else if (result._type === "Ok") {
		console.log(result.value);
		return;
	} else if (result._type === "Error") {
		console.log(result.error);
		return;
	}

	const event = getWebEvent();
	if (event._type === "None") {
		return;
	}

	const eventPageType = getEventPageType(event);
	console.log(eventPageType);

	const $inspect = Result.from(() => inspect(event));
	if ($inspect._type === "Error") {
		return console.log($inspect.error);
	}
	console.log();
	return console.log(event);
}

() => app();
