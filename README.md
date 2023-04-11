<div align="center">

# unenum

**A 0kb, Rust-like Enum/ADT mechanism for TypeScript with zero runtime
requirements.**

[Overview](#overview) • [Installation](#installation) • [`Enum`](#enum) •
[`Result`](#resultt-e) • [`Future`](#futuret) • [`safely`](#safelyfn---result)

</div>

<br />

## Overview

TypeScript should have a more versitile and ergonomic Enum/ADT mechanism that
_feels_ like native utility, as opposed its
[limited](https://www.typescriptlang.org/docs/handbook/enums.html#const-enum-pitfalls),
[misused](https://bluepnume.medium.com/nine-terrible-ways-to-use-typescript-enums-and-one-good-way-f9c7ec68bf15),
and [redundant](https://www.youtube.com/watch?v=jjMbPt_H3RQ) built-in `enum`
keyword which can be mostly replaced with a plain key-value mapping object
using `as const`.

<br />

Introducing `unenum`; a Rust-inspired, discriminable Enum/ADT type generic,
featuring:

- **Zero dependencies**; `unenum` is extremely lightweight.
- **Zero runtime requirements**; `unenum` can be completely compiled away -- no
  runtime or bundle size cost.
- **`Enum` variants that can define custom per-instance data**; impossible with
  native TypeScript `enum`s.

<br />

`unenum` wants to _feel_ like a native TypeScript utility type, _like a
pattern_, rather than a library:

- **`Enum`s are defined as `type` statements**; instead of factory functions.
- **`Enum`s are instantiated with plain object `{ ... }` syntax**; instead of
  constructors.
- **`Enum`s can be consumed (and narrowed) with plain `if` statements**;
  instead of imported match utilities.

<br />

Here's an example of `unenum`'s [`Enum`](#enum) compared with Rust's
[`enum`](https://doc.rust-lang.org/rust-by-example/custom_types/enum.html):

<table width="100%">
<tr>
<td>
<pre lang="ts">// TypeScript
 
type WebEvent = Enum<{
  // Unit
  PageLoad: undefined;
  PageUnload: undefined;
  // Tuple (use object: not feasible)
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

### `Enum.Infer<U>`

Infers the base definition of the given Enum.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
Enum.Infer<Foo>;
-> {
  A: { a: string };
  B: { b: number };
  C: undefined;
}
```

### `Enum.Merge<U>`

Combines all given Enums into a new Enum.

```ts
type A = Enum<{ A1: { a: string }; A2: undefined }>;
type B = Enum<{ B1: { b: number }; B2: undefined }>;
Enum.Merge<A | B>
-> Enum<{
  A1: { a: string };
  A2: undefined;
  B1: { b: number };
  B2: undefined;
 }>
```

### `Enum.Pick<U, V>`

Narrows a given Enum by including only the given variant keys.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
Enum.Pick<Foo, "A" | "C">
-> | { A: true; a: string }
   | { C: true }
```

### `Enum.Omit<U, V>`

Narrows a given Enum by excluding only the given variant keys.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
type FooOmit = Enum.Omit<Foo, "A" | "C">;
Enum.Omit<Foo, "A" | "C">
-> | { B: true; b: number }
```

### `Enum.Keys<U>`

Infers all possible variants keys of the given Enum.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
Enum.Keys<Foo>
-> "A" | "B" | "C"
```

### `Enum.Values<U>`

Infers all possible variant values of the given Enum.

```ts
type Foo = Enum<{ A: { a: string }; B: { b: number }; C: undefined }>;
Enum.Values<Foo>
-> | { a: string }
   | { b: string }
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
const userOrDefaultUser = $user.value ?? defaultUser;

const userOrUndefined = (await getUser("foo")).value;
```

> **Note**
>
> Instances of Results (and other Enums) can be named with a `$` prefix (e.g.
> `$user`) before unwrapping to access the value as the non-prefixed name (e.g.
> `user`).

<br />

### `Future<U>`

- `Pending`
- `...U`

Based on Rust's
[`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) trait and
[`Poll`](https://doc.rust-lang.org/std/task/enum.Poll.html) enum.

> **Note**
>
> Unlike `Result`, `Future` is a generic that appends a `Pending` variant with
> a given `Enum`.

```ts
import "unenum/global.future"; // global
import type { Future } from "unenum"; // imported
```

```tsx
const useRemoteUser = (name: string): Future<Result<User, "NotFound">> => {
	return { Pending: true };
	return { Ok: true, value: user };
	return { Err: true, value: "NotFound" };
};

const $user = useRemoteUser("foo");
if ($user.Pending) {
	return <Loading />;
}
if ($user.Err) {
	return <Error />;
}
const user = $user.value;
return <View user={user} />;

const $user = useRemoteUser("foo");
const userOrUndefined = !$userData.Pending && $userData.value;
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
