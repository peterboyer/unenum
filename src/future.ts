import type { Enum } from "./enum";

/**
Represents an asynchronous `value` that is either loading (`Pending`) or
resolved (`Ready`).

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

Future.FromEnum<Result<number>>
-> | { is: "Pending" }
   | { is: "Ok"; value: number }
   | { is: "Error" }
```

```tsx
const useRemoteUser = (name: string): Future.FromEnum<Result<User, "NotFound">> => {
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

Based on Rust's
[`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) trait and
[`Poll`](https://doc.rust-lang.org/std/task/enum.Poll.html) enum.
 */
export type Future<TValue = never> = Future.FromEnum<
	Enum<{ Ready: [TValue] extends [never] ? true : { value: TValue } }>
>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Future {
	export type FromEnum<TEnum> = Enum.Merge<Enum<{ Pending: true }> | TEnum>;
}
