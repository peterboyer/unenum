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
 * - includes general helpers to pick/omit/merge/extend/infer variants.
 * - *includes optional runtime helpers like `match` and `ResultTry`.
 *
 * Read more:
 * - wikipedia.org/wiki/Tagged_union
 * - wikipedia.org/wiki/Algebraic_data_type
 * - wikipedia.org/wiki/Comparison_of_programming_languages_(algebraic_data_type)
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
 * - This README is a valid TypeScript file!
 *
 * 1. Clone this repo: `git clone git@github.com:peterboyer/unenum.git`.
 * 2. Install dependencies: `npm install` or `yarn install`.
 * 3. Jump in!
 *
 */

/*
 *
 * ==========
 * == Enum ==
 * ==========
 *
 */

import { Enum } from "unenum";

/*
 *
 * Creating an Enum type.
 *
 * - Each property is a variant.
 * - `true` indicates a "unit" variant which has no other data.
 * - `{ ... }` indicates a "data" variant which can have other properties.
 *
 */

type User = Enum<{
	Anonymous: true;
	Authenticated: { userId: string };
}>;
// ^
// | { _type: "Anonymous" }
// | { _type: "Authenticated", userId: string }

/**
 *
 * Optional, creating a runtime value constructor.
 *
 */

const User = Enum({} as User);
// ^
// & { Anonymous: () => { _type: "Anonymous" } }
// & { Authenticated: (data: { userId: string }) => { _type: "Authenticated", userId: string } }

/*
 *
 * Instantiating an Enum value.
 *
 * - Enum values are plain objects (no classes).
 *
 */

{
	const userAnonymous = User.Anonymous();
	const userAuthenticated = User.Authenticated({ userId: "1" });

	void [userAnonymous, userAuthenticated];
}

{
	const userAnonymous: User = { _type: "Anonymous" };
	const userAuthenticated: User = { _type: "Authenticated", userId: "1" };

	void [userAnonymous, userAuthenticated];
}

/*
 *
 * Using an Enum value.
 *
 * - You may handle Enum variants using its discriminant property directly.
 * - typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
 *
 */

{
	const formatUserStatus = (user: User): string => {
		if (user._type === "Authenticated") {
			return `User is logged in as ${user.userId}.`;
		}
		return "User is not logged in.";
	};

	void [formatUserStatus];
}

/*
 *
 * Using an Enum value with `match`.
 *
 * - You may prefer the `match` Enum value helper in some cases.
 *
 */

import { match } from "unenum";
{
	const formatUserStatus = (user: User): string =>
		match(user, {
			// case
			Authenticated: ({ userId }) => `User is logged in as ${userId}.`,
			// fallback
			_: () => "User is not logged in.",
		});

	void [formatUserStatus];
}

/*
 *
 * Strict `match`.
 *
 * - You may annotate the fallback case with `undefined` to indicate that all
 *   current and future variants must be explicitly handled.
 *
 */

{
	const formatUserStatus = (user: User): string =>
		match(user, {
			Anonymous: () => "User is not logged in.",
			Authenticated: ({ userId }) => `User is logged in as ${userId}.`,
			_: undefined,
		});

	void [formatUserStatus];
}

/*
 *
 * Custom discriminants.
 *
 * - You may want to create Enums with a more descriptive discriminant.
 *
 */

type File = Enum<
	{
		"text/plain": { data: string };
		"image/jpeg": { data: Buffer; compression?: number };
		"application/json": { object: unknown };
	},
	"mime" /* <-- custom discriminant */
>;
// ^
// | { "mime": "text/plain", ... }
// | { "mime": "image/jpeg", ... }
// | { "mime": "application/json", ... }

{
	const fileTextPlain: File = { mime: "text/plain", data: "..." };
	const fileImageJpeg: File = { mime: "image/jpeg", data: Buffer.from("...") };
	const fileApplicationJson: File = { mime: "application/json", object: {} };

	void [fileTextPlain, fileImageJpeg, fileApplicationJson];
}

{
	const formatFileInformation = (file: File) => {
		if (file.mime === "text/plain") {
			return "Text";
		}

		if (file.mime === "image/jpeg") {
			return "Image";
		}

		return "Unsupported";
	};

	void [formatFileInformation];
}

{
	const formatFileInformation = (file: File) =>
		match([file, "mime"], {
			"text/plain": () => "Text",
			"image/jpeg": () => "Image",
			_: () => "Unsupported",
		});

	void [formatFileInformation];
}

/*
 *
 * Creating Enum sub-types with Enum.Pick and Enum.Omit.
 *
 */

export type UserAuthed = Enum.Pick<User, "Authenticated">;
// { _type: "Authenticated", userId: string }

export type FileWithText = Enum.Pick<File, "text/plain", "mime">;
// { "mime": "text/plain", ... }

export type UserUnauthed = Enum.Omit<User, "Authenticated">;
// { _type: "Anonymous" }

export type FileWithoutText = Enum.Omit<File, "text/plain", "mime">;
// { "mime": "image/jpeg", ... } | { "mime": "application/json", ... }

/*
 *
 * Infer all possible variant keys.
 *
 */

export type UserType = Enum.Keys<User>;
// "Anonymous" | "Authenticated"

export type FileType = Enum.Keys<File, "mime">;
// "text/plain" | "image/jpeg" | "application/json"

/*
 *
 * Infer all possible variants as an object type.
 * - Which is directly compatible with `Enum<{ ... }>`.
 *
 */

export type UserInferred = Enum.Root<User>;
// {
//   Anonymous: true;
//   Authenticated: { userId: string };
// }

export type FileInferred = Enum.Root<File, "mime">;
// {
//   "text/plain": { data: string };
//   "image/jpeg": { data: unknown; compression?: number };
//   "application/json": { object: unknown };
// }

/*
 *
 * Extend existing Enum types with new variants with `Enum.Extend`.
 *
 */

export type UserWithBanned = Enum.Extend<User, { Banned: true }>;
// | { _type: "Anonymous" }
// | { _type: "Authenticated", userId: string }
// | { _type: "Banned" }

export type FileWithHTML = Enum.Extend<File, { "text/html": true }, "mime">;
// | { "mime": "text/plain", ... }
// | { "mime": "image/jpeg", ... }
// | { "mime": "application/json", ... }
// | { "mime": "text/html", ... }

/*
 *
 * Merge two or more existing Enum types with `Enum.Merge`.
 * - This also merges the properties of variants of the same key.
 *
 */

type SetA = Enum<{ Foo: { a: string } }>;
type SetB = Enum<{ Foo: { b: number }; Bar: true }>;

export type Merged = Enum.Merge<SetA | SetB>;
// | { _type: "Foo"; a: string; b: number }
// | { _type: "Bar" }

/*
 *
 * ============
 * == Result ==
 * ============
 *
 */

import { Result } from "unenum";

export type ExampleResult = Result;
// ^
// | { _type: "Ok", value?: never, error?: never }
// | { _type: "Error", value?: never, error?: never }

export type ExampleUserResult = Result<User, "NotFound">;
// Result<User, "NotFound">
// | { _type: "Ok", value: User, error?: never }
// | { _type: "Error", value?: never, error: "NotFound" }

/*
 *
 * Instantiating a `Result` value.
 *
 * - You can create a `Result` value directly as an object: `{ _type: ... }`.
 * - Or you may use the `ResultOk` and `ResultError` helpers.
 *
 */

{
	const getResult = (): Result => {
		if (Math.random()) {
			return Result.Error();
		}

		return Result.Ok();
	};

	void [getResult];
}

{
	const getUser = (): Result<User, "NotFound"> => {
		if (Math.random()) {
			return Result.Error("NotFound");
		}

		const user = User.Anonymous();
		return Result.Ok(user);
	};

	void [getUser];
}

/*
 *
 * Returning `Result` values instead of throwing.
 *
 * - Thrown errors are not type-safe, and aren't part of a function's signature.
 * - Returning an "Error" allows the function's caller to handle it safely.
 *
 */

async function getUser(userId: number): Promise<Result<User, "NotFound">> {
	const db = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

	const user = (await db.query("...", [userId])) as User | undefined;

	if (!user) {
		return Result.Error("NotFound");
	}

	return Result.Ok(user);
}

/*
 *
 * Unwrapping a `Result`.
 *
 * - I prefer to prefix `Result` values with $ to reserve their non-prefixed
 *   values' name, e.g. `$user` (the wrapper) and `user` (the unwrapped value).
 *
 */

void (async () => {
	const $user = await getUser(1);

	// deal with the error
	if ($user.error) {
		return;
	}

	// safely access the narrowed value
	const { value: user } = $user;
	void user;
});

/*
 *
 * Usage with `match`.
 *
 */

void (async () => {
	const $user = await getUser(1);

	void match($user, {
		Ok: ({ value: user }) => {
			const message = match(user, {
				Authenticated: ({ userId }) => `Hello, user ${userId}!`,
				_: () => "Hello, stranger!",
			});
			console.log(message);
		},
		Error: ({ error }) => console.error(error),
	});
});

/*
 *
 * ===========
 * == Async ==
 * ===========
 *
 */

import { Async } from "unenum";

// Async<string>
// | { _type: "Pending" }
// | { _type: "Ready" }
//
// Async<string>
// | { _type: "Pending"; value?: never }
// | { _type: "Ready"; value: never }

// Async.Enum<Result>
// | { _type: "Pending" }
// | { _type: "Ok", value?: never, error?: never }
// | { _type: "Error", value?: never, error?: never }

/*
 *
 * Instantiating an `Async` value.
 *
 * - You can create an `Async` value directly as an object: `{ _type: ... }`.
 * - Or you may use the `AsyncPending` and `AsyncReady` helpers.
 *
 */

{
	const useResource = (): Async<Result<unknown, unknown>> => {
		const [loading, data, error] = [] as unknown as [boolean, unknown, unknown];

		if (loading) return Async.Pending();
		if (error) return Result.Error(error);
		return Result.Ok(data);
	};

	void [useResource];
}
