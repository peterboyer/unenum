import type { Enum } from "./enum";

/**
Represents an asynchronous `value` that is either loading (`Pending`) or
resolved (`Ready`).

Consider using [`Future.Enum<TEnum>`](#futureenumtenum) to when interacting with
other "wrapper" Enums like [`Result`](#resulttvalue-terror) to avoid nesting.

```ts
import "unenum/global.future"; // global
import type { Future } from "unenum"; // imported

Future
-> | { is: "Pending" }
   | { is: "Ready"; value: unknown }

Future<string>
-> | { is: "Pending" }
   | { is: "Ready"; value: string }

Future<Result<number>>
-> | { is: "Pending" }
   | { is: "Ready"; value: | { is: "Ok"; value: number }
                           | { is: "Error" } }

Future.Enum<Result<number>>
-> | { is: "Pending" }
   | { is: "Ok"; value: number }
   | { is: "Error" }
```

```tsx
const useRemoteUser = (name: string): Future<User | undefined> => {
  return { is: "Pending" };
  return { is: "Ready", value: user };
  return { is: "Ready", value: undefined };
};

const $user = useRemoteUser("foo");
if ($user.is === "Pending") { return <Loading />; }
const user = $user.value;
return <View optionalUser={user} />;

const $user = useRemoteUser("foo");
const userOrUndefined = $user.is === "Ok" ? $user.value : undefined;

const $user = useRemoteUser("foo");
const userOrDefault = $user.is === "Ok" ? $user.value : defaultUser;
```

Based on Rust's
[`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) trait and
[`Poll`](https://doc.rust-lang.org/std/task/enum.Poll.html) enum.
 */
export type Future<TValue = never> = Future.Enum<
	Enum<{ Ready: [TValue] extends [never] ? true : { value: TValue } }>
>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Future {
	/**
Helper for adding only the `Future` "Pending" variant to a given Enum that may
already have its own "Ready" state, e.g. `Result`'s `Ok` and `Error` states'.

The same can be achieved with `Enum.Extend<TEnum, { Pending: true }>`.

```ts
Future.Enum<Enum<{ A: true, B: { b: string } }>>
-> | { is: "Pending" }
   | { is: "A" }
   | { is: "B", b: string }

Future.Enum<Result<boolean>>
-> | { is: "Pending" }
   | { is: "Ok", value: boolean }
   | { is: "Error" }
```

```ts
const useRemoteUser = (name: string): Future.Enum<Result<User, "NotFound">> => {
  return { is: "Pending" };
  return { is: "Ok", value: user };
  return { is: "Error", error: "NotFound" };
};

const $user = useRemoteUser("foo");
if ($user.is === "Pending") { return <Loading />; }
if ($user.is === "Error") { return <Error />; }
const user = $user.value;
return <View user={user} />;

const $user = useRemoteUser("foo");
const userOrUndefined = $user.is === "Ok" ? $user.value : undefined;

const $user = useRemoteUser("foo");
const userOrDefault = $user.is === "Ok" ? $user.value : defaultUser;
```
	 */
	export type Enum<TEnum> = Enum.Extend<TEnum, { Pending: true }>;
}
