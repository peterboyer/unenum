/*
 * ███    █▄  ███▄▄▄▄      ▄████████ ███▄▄▄▄   ███    █▄    ▄▄▄▄███▄▄▄▄
 * ███    ███ ███▀▀▀██▄   ███    ███ ███▀▀▀██▄ ███    ███ ▄██▀▀▀███▀▀▀██▄
 * ███    ███ ███   ███   ███    █▀  ███   ███ ███    ███ ███   ███   ███
 * ███    ███ ███   ███  ▄███▄▄▄     ███   ███ ███    ███ ███   ███   ███
 * ███    ███ ███   ███ ▀▀███▀▀▀     ███   ███ ███    ███ ███   ███   ███
 * ███    ███ ███   ███   ███    █▄  ███   ███ ███    ███ ███   ███   ███
 * ███    ███ ███   ███   ███    ███ ███   ███ ███    ███ ███   ███   ███
 * ████████▀   ▀█   █▀    ██████████  ▀█   █▀  ████████▀   ▀█   ███   █▀
 *
 * A TypeScript ADT utility that can be completely compiled away.
 *
 */

// Installation
// ============

/*
 * yarn add unenum
 * npm install unenum
 */

// Playground
// ==========

// This README is a valid TypeScript file!
// 1. Clone this repo: `git clone git@github.com:peterboyer/unenum.git`.
// 2. Install dependencies: `npm install` or `yarn install`.
// 3. Jump in!

// Usage
// =====

import { type Enum } from "unenum";

// Defining an Enum type.
// ----------------------

type User = Enum<{
	Anonymous: true;
	Authenticated: { userId: string };
}>;

// User =
//   | { _type: "Anonymous" }
//   | { _type: "Authenticated", userId: string }

// Using an `Enum` type.
// ---------------------

function formatUserStatus(user: User): string {
	if (user._type === "Authenticated") {
		return `User is logged in as ${user.userId}.`;
	}
	return "User is not logged in.";
}

// Instantiating an `Enum` value.
// ------------------------------

const userAnonymous: User = { _type: "Anonymous" };
const userAuthenticated: User = { _type: "Authenticated", userId: "1" };

void formatUserStatus(userAnonymous);
void formatUserStatus(userAuthenticated);

// Using the `match` utility.
// --------------------------

import { match } from "unenum";

const formatUserStatusWithMatch = (user: User): string =>
	match(user)({
		// case
		Authenticated: ({ userId }) => `User is logged in as ${userId}.`,
		// default
		_: () => "User is not logged in.",
	});

void formatUserStatusWithMatch(userAnonymous);
void formatUserStatusWithMatch(userAuthenticated);

// Strict `match`.
// ---------------
// - Useful if you want to ensure that all future cases are explicitly handled.

void ((user: User): string =>
	match(user)({
		Anonymous: () => "User is not logged in.",
		Authenticated: ({ userId }) => `User is logged in as ${userId}.`,
		// annotate that the fallback case is not wanted
		_: undefined,
	}));

// Using a custom discriminant.
// ----------------------------

type File = Enum<
	{
		"text/plain": { data: string };
		"image/jpeg": { data: unknown; compression?: number };
		"application/json": { object: unknown };
	},
	"mime" // <-- custom discriminant
>;

// File =
//   | { "mime": "text/plain", ... }
//   | { "mime": "image/jpeg", ... }
//   | { "mime": "application/json", ... }

const fileTextPlain: File = { mime: "text/plain", data: "..." };
const fileImageJpeg: File = { mime: "image/jpeg", data: Buffer.from("...") };
const fileApplicationJson: File = { mime: "application/json", object: {} };

const formatFileInformation = (file: File) =>
	match(
		file,
		"mime" // <-- custom discriminant
	)({
		"text/plain": () => "Text",
		"image/jpeg": () => "Image",
		"application/json": () => "Image",
		_: () => "Unsupported",
	});

void formatFileInformation(fileTextPlain);
void formatFileInformation(fileImageJpeg);
void formatFileInformation(fileApplicationJson);
