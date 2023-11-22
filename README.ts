/*
 *  _ _ ___ ___ ___ _ _ _____
 * | | |   | -_|   | | |     |
 * |___|_|_|___|_|_|___|_|_|_|
 *
 * A TypeScript ADT utility that can be completely compiled away.
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

import { type Enum } from "unenum";

/*
 *
 * Defining an Enum type.
 *
 */

type User = Enum<{
  Anonymous: true;
  Authenticated: { userId: string };
}>;

// User
// | { _type: "Anonymous" }
// | { _type: "Authenticated", userId: string }

/*
 *
 * Using an `Enum` type.
 *
 */

function formatUserStatus(user: User): string {
  if (user._type === "Authenticated") {
    return `User is logged in as ${user.userId}.`;
  }
  return "User is not logged in.";
}

/*
 *
 * Instantiating an `Enum` value.
 *
 */

const userAnonymous: User = { _type: "Anonymous" };
const userAuthenticated: User = { _type: "Authenticated", userId: "1" };

void formatUserStatus(userAnonymous);
void formatUserStatus(userAuthenticated);

/*
 *
 * Using the `match` utility.
 *
 */

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

/*
 *
 * Strict `match`.
 *
 * - Useful indicate that any new variant cases are explicitly handled.
 *
 */

void ((user: User): string =>
  match(user)({
    Anonymous: () => "User is not logged in.",
    Authenticated: ({ userId }) => `User is logged in as ${userId}.`,
    // annotate that the fallback case is not wanted
    _: undefined,
  }));

/*
 *
 * Using a custom discriminant.
 *
 */

type File = Enum<
  {
    "text/plain": { data: string };
    "image/jpeg": { data: unknown; compression?: number };
    "application/json": { object: unknown };
  },
  "mime" // <-- custom discriminant
>;

// File
// | { "mime": "text/plain", ... }
// | { "mime": "image/jpeg", ... }
// | { "mime": "application/json", ... }

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

/*
 *
 * ============
 * == Result ==
 * ============
 *
 */

import { type Result } from "unenum";

// Result
// | { _type: "Ok", value?: never, error?: never }
// | { _type: "Error", value?: never, error?: never }

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

import { ResultOk, ResultError } from "unenum";

// raw
void ((): Result => ({ _type: "Ok" }));
void ((): Result => ({ _type: "Error" }));
void ((): Result<User, "NotFound"> => ({ _type: "Ok", value: userAnonymous }));
void ((): Result<User, "NotFound"> => ({ _type: "Error", error: "NotFound" }));

// with helper
void ((): Result => ResultOk());
void ((): Result => ResultError());
void ((): Result<User, "NotFound"> => ResultOk(userAnonymous));
void ((): Result<User, "NotFound"> => ResultError("NotFound"));

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
    return ResultError("NotFound");
  }

  return ResultOk(user);
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

  void match($user)({
    Ok: ({ value: user }) => {
      const message = match(user)({
        Authenticated: ({ userId }) => `Hello, user ${userId}!`,
        _: () => "Hello, stranger!",
      });
      console.log(message);
    },
    Error: ({ error }) => console.error(error),
  });
});

/* eslint prettier/prettier: ["error", { useTabs: false }] */
