<div align="center">

# unenum

**A 0kb, Rust-like Enum mechanism for TypeScript to use instead of the `enum`-builtin.**

Create your own `Enum`s with no runtime dependencies! Includes `Result` and `Future` Enums!

[Overview](#overview) • [Installation](#installation) • [`Enum`](#enum) • [`Result`](#resultt-e---okt--erre) • [`Future`](#futuret---readyt--pending) • [`safely`](#safelyfn---result)

</div>

## Overview

<table width="100%">
<tr>
<td>
<pre>// TypeScript
type WebEvent = Enum<{
	// Unit
	PageLoad: undefined;
	PageUnload: undefined;
	// Tuple (not feasible, use object)
	KeyPress: { key: string };
	Paste: { content: string };
	// Object
	Click: { x: number; y: number };
}></pre><img width="441" height="1">
<pre>function inspect(event: WebEvent) {
	 
	if (event.PageLoad) console.log(...);
	else if (event.PageUnload) console.log(...);
	else if (event.KeyPress) console.log(..., event.key);
	else if (event.Paste) console.log(..., event.content);
	else if (event.Click) { const { x, y } = event; console.log(..., x, y); }
	 
}

const event = { PageLoad: true };
const event = { PageUnload: true };
const event = { KeyPress: true, key: "x" };
const event = { Paste: true, content: "..." };
const event = { Click: true, x: 10, y: 10 };

</pre>
</td>
<td>
<pre>// Rust
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
<pre>fn inspect(event: WebEvent) {
	match event {
		WebEvent::PageLoad => println!(...),
		WebEvent::PageUnload => println!(...),
		WebEvent::KeyPress(c) => println!(..., c),
		WebEvent::Paste(s) => println!(..., s),
		WebEvent::Click { x, y } => println!(..., x, y),
	}
}

let event = WebEvent::PageLoad;
let event = WebEvent::PageUnload;
let event = WebEvent::KeyPress('x')
let event = WebEvent::Paste("...".to_owned());
let event = WebEvent::Click { x: 10, y: 10 };

</pre>
</td>
</table>

## Installation

```sh
$ yarn add unenum
```

For Applications (Global):

```ts
import "unenum/enum";
```

For Libraries (Imported):

```ts
import type { Enum } from "unenum";
```

## `Enum`

Creates a union of mutually exclusive, discriminable variants.

```ts
import "unenum/enum"; // global
import type { Enum } from "unenum"; // imported
```

```ts
type Foo = Enum<{
  A: { a: string };
  B: { b: number };
  C: undefined;
}>
-> | { A:  true ; B?: never; C?: never; a: string; }
   | { A?: never; B:  true ; C?: never; b: number; }
   | { A?: never; B?: never; C:  true ;            }

const foo: Foo = { A: true, a: "abc" };
const foo: Foo = { B: true, b: 12345 };
const foo: Foo = { C: true,          };

if      (foo.A) { foo.a; -> string }
else if (foo.B) { foo.b; -> number }
else            { ... }
```

### `Enum.Keys<T>`

Infers all possible variants keys of the given Enum.

```ts
type Foo = Enum<{ A: { a: string }, B: { b: number }, C: undefined }>
type FooKeys = Enum.Keys<Foo>
-> "A" | "B" | "C"
```

### `Enum.Values<T>`

Infers all possible variant values of the given Enum.

```ts
type Foo = Enum<{ A: { a: string }, B: { b: number }, C: undefined }>
type FooValues = Enum.Values<Foo>
-> { a: string } | { b: string }
```

### `Enum.Pick<T, V>`

Picks all given variants of the given Enum by variant keys.

```ts
type Foo = Enum<{ A: { a: string }, B: { b: number }, C: undefined }>
type FooPick = Enum.Pick<Foo, "A" | "C">
-> { A: true, a: string } | { C: true }
```

## Enums

### `Result<T, E>`

- `::Ok { value: T; error?: never; }`
- `::Err { error: E; value?: never; }`

Based on Rust's [`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) enum.

```tsx
import "unenum/result"; // global
import type { Result } from "unenum"; // imported
```

```tsx
const getUser = async (name: string): Promise<Result<User, "NotFound">> => {
  return { Ok: true, value: user }
  return { Err: true, error: "NotFound" }
}

// handle error then narrow to value
const $user = await getUser("foo");
if ($user.Err) { return ... }
const user = $user.value;

// value or undefined if error
const $user = await getUser("foo");
const user = $user.value;
const user = $user.Ok && $user.value;

// value or undefined if error (shortest)
const user = (await getUser("foo")).value;
```

### `Future<T>`

- `::Ready { value: T; }`
- `::Pending { value?: never; }`

Based on Rust's [`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) trait and [`Poll`](https://doc.rust-lang.org/std/task/enum.Poll.html) enum.

```tsx
import "unenum/future"; // global
import type { Future } from "unenum"; // imported
```

```tsx
const useRemoteUser = async (
	name: string
): Future<Result<User, "NotFound" | "DataError">> => {
	return { Pending: true };
	const $user = { Ok: { value: user } };
	const $user = { Err: { value: "NotFound" } };
	return { Ready: $user };
};

// handle pending and error
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

// value or undefined if pending
const $userData = useRemoteUserData("foo");
const $user = $userData.value;

// value or undefined if pending (shortest)
const $user = useRemoteUserData("foo").value;

// value or undefined if pending or if ready with error
const user = useRemoteUserData("foo").value?.value;
```

## Utils

### `safely(fn) -> Result`

Executes a given function and returns a `Result`:

- `::Ok`, with the function's inferred `return` value,
- `::Err`, with `unknown` of any potentially `thrown` errors.

```tsx
import { safely } from "unenum/fns"; // runtime
```

```tsx
const $data = safely(() => fn(...))
const data = $data.value

const $data = await safely(async () => (await fn(...)))
const data = $data.value
```
