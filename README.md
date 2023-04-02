<div align="center">

# unenum

**A 0kb, Rust-like Enum/ADT mechanism for TypeScript to use instead of the
`enum`-builtin.**

Create your own `Enum`s with no runtime dependencies, instantiate them with
plain objects, and consume them with simple `if` statements or
optional-chaining. Includes `Result` and `Future`!

[Overview](#overview) • [Installation](#installation) • [`Enum`](#enum) •
[`Result`](#resultt-e) • [`Future`](#futuret) • [`safely`](#safelyfn---result)

</div>

<br />

## Overview

- A side-by-side example of `unenum`'s `Enum` compared with Rust's built-in
  `enum`.
- Based on Rust's Enum documentation `WebEvent` example,
  [here](https://doc.rust-lang.org/rust-by-example/custom_types/enum.html).

<table width="100%">
<tr>
<td>
<pre lang="ts">// TypeScript
 
type WebEvent = Enum<{
  // Unit
  PageLoad: undefined;
  PageUnload: undefined;
  // Tuple (use object, not feasible)
  KeyPress: { key: string };
  Paste: { content: string };
  // Object
  Click: { x: number; y: number };
}></pre><img width="441" height="1">
<pre lang="ts">const event: WebEvent = { PageLoad: true };
const event: WebEvent = { PageUnload: true };
const event: WebEvent = { KeyPress: true, key: "x" };
const event: WebEvent = { Paste: true, content: "..." };
const event: WebEvent = { Click: true, x: 10, y: 10 };
 
function inspect(event: WebEvent) {
   
  if (event.PageLoad) console.log(...);
  else if (event.PageUnload) console.log(...);
  else if (event.KeyPress) console.log(..., event.key);
  else if (event.Paste) console.log(..., event.content);
  else if (event.Click) console.log(..., event.x, event.y);
   
}
</pre></td>

<td>
<pre lang="rust">// Rust
 
enum WebEvent {
  // Unit
  PageLoad,
  PageUnload,
  // Tuple
  KeyPress(char),
  Paste(String),
  // Struct
  Click { x: i64, y: i64 },
}</pre><img width="441" height="1">
<pre lang="rust">let event = WebEvent::PageLoad;
let event = WebEvent::PageUnload;
let event = WebEvent::KeyPress('x')
let event = WebEvent::Paste("...".to_owned());
let event = WebEvent::Click { x: 10, y: 10 };
 
fn inspect(event: WebEvent) {
  match event {
    WebEvent::PageLoad => println!(...),
    WebEvent::PageUnload => println!(...),
    WebEvent::KeyPress(c) => println!(..., c),
    WebEvent::Paste(s) => println!(..., s),
    WebEvent::Click { x, y } => println!(..., x, y),
  }
}
</pre></td>

</table>

<br />

## Installation

```sh
npm install unenum
```

For Applications
([Global](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html)):

```ts
import "unenum/global";
```

For Libraries
([Imported](https://www.typescriptlang.org/docs/handbook/2/modules.html#import-type)):

```ts
import type { ... } from "unenum";
```

<br />

## `Enum`

Creates a union of mutually exclusive, discriminable variants.

```ts
import "unenum/global.enum"; // global
import type { Enum } from "unenum"; // imported
```

```ts
type Foo = Enum<{
  A: { a: string };
  B: { b: number };
  C: undefined;
}>;
-> | { A:  true ; B?: never; C?: never; a: string }
   | { A?: never; B:  true ; C?: never; b: number }
   | { A?: never; B?: never; C:  true             }

const foo: Foo = { A: true, a: "abc" };
const foo: Foo = { B: true, b: 12345 };
const foo: Foo = { C: true           };

if      (foo.A) { foo.a -> string }
else if (foo.B) { foo.b -> number }
else            { ... }
```

### `Enum.Keys<T>`

Infers all possible variants keys of the given Enum.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
type FooKeys = Enum.Keys<Foo>;
-> "A" | "B" | "C"
```

### `Enum.Values<T>`

Infers all possible variant values of the given Enum.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
type FooValues = Enum.Values<Foo>;
-> { a: string } | { b: string }
```

### `Enum.Pick<T, V>`

Narrows a given Enum by the given variant keys.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
type FooPick = Enum.Pick<Foo, "A" | "C">;
-> { A: true; a: string } | { C: true }
```

<br />

## Included Enums

### `Result<T, E>`

- `Ok { value: T; error?: never }`
- `Err { error: E; value?: never }`

Based on Rust's
[`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) enum.

> **Note**
>
> `Result` uses `value?: never` and `error?: never` to allow for shorthand
> access to `.value` or `.error` if you want to default to `undefined` if
> either property is not present.

```ts
import "unenum/global.result"; // global
import type { Result } from "unenum"; // imported
```

```ts
const getUser = async (name: string): Promise<Result<User, "NotFound">> => {
  return { Ok: true, value: user };
  return { Err: true, error: "NotFound" };
}

const $user = await getUser("foo");
if ($user.Err) { return ... }
const user = $user.value;

const $user = await getUser("foo");
const userOrUndefined = $user.value;
const userOrUndefined = $user.Ok && $user.value;

const userOrUndefined = (await getUser("foo")).value;
```

> **Note**
>
> One pattern to help with naming instances of Results (and other Enums) is to
> prefix it with a `$` (e.g. `$user`) before unwrapping to access the value as
> the non-prefixed name (e.g. `user`).

<br />

### `Future<T>`

- `Ready { value: T }`
- `Pending { value?: never }`

Based on Rust's
[`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) trait and
[`Poll`](https://doc.rust-lang.org/std/task/enum.Poll.html) enum.

> **Note**
>
> `Future` uses `value?: never` to allow for shorthand access to `.value` if
> you want to default to `undefined` if `value` is not present (i.e. when
> `Pending`).

```ts
import "unenum/global.future"; // global
import type { Future } from "unenum"; // imported
```

```tsx
const useRemoteUser = async (
	name: string
): Future<Result<User, "NotFound">> => {
	const $user = { Ok: true, value: user };
	const $user = { Err: true, value: "NotFound" };
	return { Ready: true, value: $user };
	return { Pending: true };
};

const $userData = useRemoteUserData("foo");
if ($userData.Pending) {
	return <Loading />;
}
const $user = $userData.value;
if ($user.Err) {
	return <Error />;
}
const user = $user.value;
return <View user={user} />;

const $userData = useRemoteUserData("foo");
const $userOrUndefined = $userData.value;
const userOrUndefined = $userOrUndefined?.value;

const $userOrUndefined = useRemoteUserData("foo").value;
const userOrUndefined = useRemoteUserData("foo").value?.value;
```

<br />

## Utils

### `safely(fn) -> Result`

Executes a given function and wraps value in a `Result`:

- `Ok`, with the function's inferred `return` value,
- `Err`, with `unknown` of any potentially `thrown` errors.
- Automatically wraps `Result` with `Promise<...>` if given function is
  async/returns a `Promise`.

```ts
import { safely } from "unenum"; // runtime
```

```ts
const $data = safely(() => fn(...));
const dataOrUndefined = $data.value;
if ($data.Err) { return ... }
const data = $data.value;

const $data = await safely(async () => (await fn(...)));
const dataOrUndefined = $data.value;
if ($data.Err) { return ... }
const data = $data.value;
```
