import type { Expect, Equal, NotEqual } from "./testutils";
import { Enum } from "./enum";

export type WebEvent = Enum<{
	PageLoad: true;
	PageUnload: true;
	KeyPress: [char: string];
	Paste: string;
	Click: { x: number; y: number };
}>;

const Click = Enum("Click");
const ClickData = Enum("Click", { x: 0, y: 0 });
const EnumClick: WebEvent = Enum("Click");
const EnumClickData: WebEvent = Enum("Click", { x: 0, y: 0 });

void EnumClick;
void EnumClickData;

({}) as [
	Expect<NotEqual<typeof Click, never>>,
	Expect<NotEqual<typeof ClickData, never>>,
	Expect<Equal<(typeof Click)["type"], "Click">>,
	Expect<Equal<(typeof Click)["data"], undefined>>,
	Expect<Equal<(typeof ClickData)["type"], "Click">>,
	Expect<Equal<(typeof ClickData)["data"], { x: number; y: number }>>
];

// ---

export const events: WebEvent[] = [
	Enum("PageLoad"),
	{ type: "PageLoad" },

	Enum("PageUnload"),
	{ type: "PageUnload" },

	Enum("KeyPress", ["<space>"]),
	// @ts-expect-error Number not assignable to string.
	Enum("KeyPress", [1]),
	{ type: "KeyPress", data: ["<space>"] },
	// @ts-expect-error Number not assignable to string.
	{ type: "KeyPress", data: [1] },

	Enum("Paste", "content"),
	{ type: "Paste", data: "content" },

	Enum("Click", { x: 4, y: 20 }),
	{ type: "Click", data: { x: 4, y: 20 } },

	// errors
	// @ts-expect-error Undefined is not assignable to never.
	Enum("PageLoad", undefined),
	// @ts-expect-error Undefined is not assignable to never.
	{ type: "PageLoad", data: undefined },

	// @ts-expect-error Type is incompatible.
	Enum("KeyPress", undefined),
	// @ts-expect-error Type is incompatible.
	{ type: "KeyPress", data: undefined },
];

// ---

export type Result<TOk = true, TError = true> = Enum<{
	Ok: TOk;
	Error: TError;
}>;

export function getResultDefault(): Result {
	if (new Date().toString() === 'Enum("Ok", ...)') {
		return Enum("Ok");
	}
	if (new Date().toString() === '{ type: "Ok", data: ... }') {
		return { type: "Ok" };
	}
	if (new Date().toString() === 'Enum("Error", ...)') {
		return Enum("Error");
	}
	if (new Date().toString() === '{ type: "Error", data: ... }') {
		return { type: "Error" };
	}
	throw new TypeError();
}

export function getResultSpecific():
	| Result<number, "OutOfRange">
	| Enum<{ Pending: true }> {
	if (new Date().toString() === 'Enum("Ok", ...)') {
		return Enum("Ok", 100);
	}
	if (new Date().toString() === '{ type: "Ok", data: ... }') {
		return { type: "Ok", data: 100 };
	}
	if (new Date().toString() === 'Enum("Error", ...)') {
		return Enum("Error", "OutOfRange");
	}
	if (new Date().toString() === '{ type: "Error", data: ... }') {
		return { type: "Error", data: "OutOfRange" };
	}
	if (new Date().toString() === 'Enum("Pending")') {
		return Enum("Pending");
	}
	if (new Date().toString() === '{ type: "Pending" }') {
		return { type: "Pending" };
	}
	throw new TypeError();
}
