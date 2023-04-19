import type { Enum } from "./enum";

/**
Represents an asynchronous value that is either loading (`Pending`) or resolved
(`Ready`). If given an `Enum` parameter, `Future` will merge only the `Pending`
variant with it.

```ts
Future<string>
-> | { is: "Pending" }
   | { is: "Ready", value: string }

Future<Result<number>>
-> | { is: "Pending" }
   | { is: "Ok"; value: number }
   | { is: "Err"; error: unknown }

Future<Result<number, "FetchError">>
-> | { is: "Pending" }
   | { is: "Ok"; value: number }
   | { is: "Err"; error: "FetchError" }
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
const userOrUndefined = $user.is === "Ok" ? $user.value : undefined;
const userOrDefault = $user.is === "Ok" ? $user.value : defaultUser;
```

Based on Rust's
[`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) trait and
[`Poll`](https://doc.rust-lang.org/std/task/enum.Poll.html) enum.
 */
// prettier-ignore
export type Future<TValueOrEnum = unknown> = TValueOrEnum extends { is: string }
	? TValueOrEnum extends infer TEnum
		? Enum<{ Pending: undefined }> | TEnum
		: never
	: TValueOrEnum extends infer TValue
		? Enum<{ Pending: undefined; Ready: { value: TValue } }>
		: never;
