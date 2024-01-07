/*
 *  _ _ ___ ___ ___ _ _ _____
 * | | |   | -_|   | | |     |
 * |___|_|_|___|_|_|___|_|_|_|
 *
 * Universal ADT utilities for TypeScript.
 *
 * - produces simple and portable discriminated union types.
 * - all types can be compiled away, with zero-cost to bundle size.
 * - includes primitives like `Result` to improve function error-handling.
 * - includes general helpers to inspect/pick/omit/merge/extend variants.
 * - includes optional runtime helpers like `match` and `Result.try`.
 *
 * Read more:
 * - https://wikipedia.org/wiki/Tagged_union
 * - https://wikipedia.org/wiki/Algebraic_data_type
 * - https://wikipedia.org/wiki/Comparison_of_programming_languages_(algebraic_data_type)
 *
 */

/*
 *
 * Installation
 *
 * - yarn add unenum
 * - npm install unenum
 *
 */

/*
 *
 * Playground
 *
 * - This README.ts is a valid TypeScript file!
 *
 * 1. Clone this repo: `git clone git@github.com:peterboyer/unenum.git`.
 * 2. Install development dependencies: `npm install` or `yarn install`.
 * 3. Jump in!
 *
 */

import { Enum } from "unenum";

// type
export type User = Enum<{
	Anonymous: true;
	Authenticated: { userId: string };
}>;

// value
// (a) object expression
void ((): User => ({ _type: "Anonymous" }));
void ((): User => ({ _type: "Authenticated", userId: "..." }));

// (b) helper function
export const User = Enum({} as User);
void (() => User.Anonymous());
void (() => User.Authenticated({ userId: "..." }));

// logic
// (a) if statements
void ((user: User): string => {
	if (user._type === "Authenticated") {
		return `Logged in as ${user.userId}.`;
	}
	return "Not logged in.";
});

// (b) match expression
import { match } from "unenum";
void ((user: User): string =>
	match(user, {
		Authenticated: ({ userId }) => `Logged in as ${userId}.`,
		_: () => "Not logged in.",
	}));

// strict match
void ((user: User): string =>
	match(user, {
		Authenticated: ({ userId }) => `Logged in as ${userId}.`,
		Anonymous: () => "Not logged in.",
		_: undefined,
	}));

// utils
// =====
export type Signal = Enum<{ Red: true; Yellow: true; Green: true }>;

void ({} as [
	// Root definition of variants
	Enum.Root<Signal>, // { Red: true, Yellow: true; Green: true }

	// Keys of variants
	Enum.Keys<Signal>, // "Red" | "Yellow" | "Green"

	// Pick subset of variants
	Enum.Pick<Signal, "Red">, // Red
	Enum.Pick<Signal, "Red" | "Yellow">, // Red | Yellow

	// Omit subset of variants
	Enum.Omit<Signal, "Red">, // Yellow | Green
	Enum.Omit<Signal, "Red" | "Yellow">, // Green

	// Extend with new variants
	Enum.Extend<Signal, { Flashing: true }>, // Red | Yellow | Green | Flashing

	// Root definition of variants
	Enum.Merge<Enum<{ Left: true }> | Enum<{ Right: true }>>, // Left | Right
]);

// value with mapper
type Colour = Enum<{
	Transparent: true;
	RGB: Record<"r" | "g" | "b", number>;
}>;
export const Colour = Enum({} as Colour, {
	RGB: (r: number, g: number, b: number) => ({ r, g, b }),
});
void ((): Colour => Colour.Transparent());
void ((): Colour => Colour.RGB(0, 0, 0));

// custom discriminant
// ===================

// type
export type File = Enum<
	{
		"text/plain": { data: string };
		"image/jpeg": { data: Buffer; compression?: number };
		"application/json": { object: unknown };
	},
	"mime" /* <-- */
>;

// value
// (a) object expression
void ((): File => ({ mime: "text/plain", data: "..." }));
void ((): File => ({ mime: "image/jpeg", data: Buffer.from("...") }));
void ((): File => ({ mime: "application/json", object: JSON.parse("{}") }));

// (b) helper function
export const File = Enum({} as File, "mime");
void (() => File["text/plain"]({ data: "..." }));
void (() => File["image/jpeg"]({ data: Buffer.from("...") }));
void (() => File["application/json"]({ object: JSON.parse("{}") }));

// logic
// (a) if statements
void ((file: File): string => {
	if (file.mime === "text/plain") {
		return `Text`;
	}
	if (file.mime === "image/jpeg") {
		return "Image";
	}
	return "Unsupported";
});

// (b) match expression
void ((file: File): string =>
	match(file, "mime", {
		"text/plain": () => "Text",
		"image/jpeg": () => "Image",
		_: () => "Unsupported",
	}));

// "result" primitive
// ==================
import { Result } from "unenum";

// type/value without value/error type
void ((): Result => {
	if (Math.random()) {
		return Result.Error();
	}
	return Result.Ok();
});

// type/value with value/error type
void ((): Result<User, "NotFound"> => {
	const user = {} as User | undefined;
	if (!user) {
		return Result.Error("NotFound");
	}
	return Result.Ok(user);
});

// logic
// (a) if statements
void (async (): Promise<User | undefined> => {
	const $user = await (async () => ({}) as Promise<Result<User>>)();
	// handle error
	if ($user._type === "Error") {
		return undefined;
	}
	// continue with value
	const { value: user } = $user;
	return user;
});

// (b) match expression
void (async (): Promise<User | undefined> => {
	const $user = await (async () => ({}) as Promise<Result<User>>)();
	return match($user, {
		Ok: ({ value: user }) => user,
		Error: () => undefined,
	});
});

// "async" primitive
// =================
import { Async } from "unenum";

// type/value without value/error type
void ((): Async => {
	if (Math.random()) {
		return Async.Pending();
	}
	return Async.Ready();
});

// type/value with primitive type
void ((): Async<boolean> => {
	const user = {} as User | undefined;
	if (!user) {
		return Async.Pending();
	}
	return Async.Ready(true);
});

// type/value with enum type (extends with Pending variant)
void ((): Async<Result<User, "NotFound">> => {
	const loading = true as boolean;
	const user = {} as User | undefined;
	if (loading) {
		return Async.Pending();
	}
	if (!user) {
		return Result.Error("NotFound");
	}
	return Result.Ok(user);
});

// logic
// (a) if statements
void (async () => {
	const $user = (() => ({}) as Async<Result<User, "E">>)();
	if ($user._type === "Pending") {
		return `<Loading />`;
	}
	// handle error
	if ($user._type === "Error") {
		const { error } = $user;
		return `<Error error=${error} />`;
	}
	// continue with value
	const { value: user } = $user;
	return `<Profile user=${user} />`;
});

// (b) match expression
void (async () => {
	const $user = (() => ({}) as Async<Result<User, unknown>>)();
	return match($user, {
		Pending: () => `<Loading />`,
		Error: ({ error }) => `<Error error=${error} />`,
		Ok: ({ value: user }) => `<Profile user=${user} />`,
	});
});
