import type { Enum } from "./enum";

/**
Represents an asynchronous `value` that is either loading (`Pending`) or
resolved (`Ready`). If defined with an `Enum` type, `Future` will omit its
`Ready` variant in favour of the "non-pending" `Enum`'s variants.

_`Future` uses `value?: never` to allow for shorthand access to `.value` if you
want to safely default to `undefined` if it is not available. If using with an
`Enum` type, all its _common_ properties will be extended as `?: never`
properties on the `Pending` variant to allow for shorthand `undefined` access
also. (See `Enum.Props`.)

```ts import "unenum/global.future"; // global
import type { Future } from "unenum"; // imported

Future
-> | { is: "Pending"; value?: never }
   | { is: "Ready"; value: unknown }

Future<string>
-> | { is: "Pending"; value?: never }
   | { is: "Ready"; value: string }

Future<Result<number>>
-> | { is: "Pending"; value?: never; error?: never }
   | { is: "Ok"; value: number; error?: never }
   | { is: "Err"; error: unknown; value?: never }
```

```tsx
const useRemoteUser = (name: string): Future<Result<User, "NotFound">> => {
	return { is: "Pending" };
	return { is: "Ok", value: user };
	return { is: "Err", error: "NotFound" };
};

const $user = useRemoteUser("foo");
if ($user.is === "Pending") { return <Loading />; }
if ($user.is === "Err") { return <Error />; }
const user = $user.value;
return <View user={user} />;

const $user = useRemoteUser("foo");
const userOrUndefined = $user.value;
const userOrUndefined = $user.is === "Ok" ? $user.value : undefined;

const $user = useRemoteUser("foo");
const userOrDefault = $user.value ?? defaultUser;
const userOrDefault = $user.is === "Ok" ? $user.value : defaultUser;
```

Based on Rust's
[`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) trait and
[`Poll`](https://doc.rust-lang.org/std/task/enum.Poll.html) enum.
 */
export type Future<TValueOrEnum = unknown> = [TValueOrEnum] extends [never]
	? Enum<{ Pending: { value?: never }; Ready: { value: TValueOrEnum } }>
	: [TValueOrEnum] extends [{ is: string }]
	?
			| Enum<{ Pending: Partial<Record<Enum.Props<TValueOrEnum>, never>> }>
			| TValueOrEnum
	: Enum<{ Pending: { value?: never }; Ready: { value: TValueOrEnum } }>;
