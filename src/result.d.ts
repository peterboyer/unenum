import type { Enum } from "./enum";

/**
Represents either success (`Ok`) or failure (`Err`).

_`Result` uses `value?: never` and `error?: never` to allow for shorthand access
to `.value` or `.error` if you want to safely default to `undefined` if neither
property is available._

```ts
import "unenum/global.result"; // global
import type { Result } from "unenum"; // imported

Result<number>
-> | { is: "Ok"; value: number; error?: never }
   | { is: "Err"; error: unknown; value?: never }

Result<number, "FetchError">
-> | { is: "Ok"; value: number; error?: never }
   | { is: "Err"; error: "FetchError"; value?: never }
```

```ts
const getUser = async (name: string): Promise<Result<User, "NotFound">> => {
	return { is: "Ok", value: user };
	return { is: "Err", error: "NotFound" };
}

const $user = await getUser("foo");
if ($user.is === "Err") { return ... }
const user = $user.value;

const $user = await getUser("foo");
const userOrUndefined = $user.value;
const userOrUndefined = $user.is === "Ok" ? $user.value : undefined;

const $user = await getUser("foo");
const userOrDefault = $user.value ?? defaultUser;
const userOrDefault = $user.is === "Ok" ? $user.value : defaultUser;
```

Based on Rust's
[`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) enum.
 */
export type Result<T = unknown, E = unknown> = Enum<{
	Ok: { value: T; error?: never };
	Err: { error: E; value?: never };
}>;
