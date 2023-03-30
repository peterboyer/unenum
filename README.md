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
	// Tuple
	KeyPress: [string];
	Paste: [string];
	// Object
	Click: { x: number; y: number; };
}></pre><img width="441" height="1">
<pre>function inspect(event: WebEvent) {
	 
	if (event.PageLoad) console.log(...);
	else if (event.PageUnload) console.log(...);
	else if (event.KeyPress) console.log(..., event[0]);
	else if (event.Paste) { const [s] = event; console.log(..., s); }
	else if (event.Click) { const { x, y } = event; console.log(..., x, y); 
	 
}</pre>
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
}</pre>
</td>
</table>

## Installation

```shell
$ yarn add unenum
```

For Applications (Global):

```tsx
import "unenum/enum";
```

For Libraries (Imported):

```tsx
import type { Enum } from 'unenum';
```

## `Enum`

Creates a union of mutually exclusive, discriminable variants.

- Variants with a value (`: T`) will be wrapped in a truthy `{ value: T }` box.
- Variants without a value (`?: void`) will be truthy as `true`.

```tsx
import "unenum/enum"; // global
import type { Enum } from 'unenum'; // imported
```

```tsx
type Foo = Enum<{ A: string; B: number; C?: void; }>
-> | { A: { value: string }; B?: never;            C?: never; }
   | { A?: never;            B: { value: number }; C?: never; }
   | { A?: never;            B?: never;            C: true;   }
                                                                              
const foo: Foo = { A: { value: "abc" } };
const foo: Foo = { B: { value: 123   } };
const foo: Foo = { C: true             };
                                                                              
if (foo.A)      { foo.A.value; -> string }
else if (foo.B) { foo.B.value; -> number }
else            { foo.C;       -> true   }
```


### `Enum.Infer<T>`

Infers a given Enum's root definition, from which variants' value type
may be further inferred.

```tsx
type FooRoot = Enum.Infer<{ A: string | number; B?: void; }>
-> { A: string | number; B?: void; }
                                                                         
FooRoot["A"] -> :-? string | number
FooRoot["B"] -> :+? void | undefined
```

## Enums

### `Result<T, E> -> ::Ok<T> | ::Err<E>`

Based on Rust's [`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) enum.

```tsx
import "unenum/result"; // global
import type { Result } from 'unenum'; // imported
```

```tsx
const getUser = async (name: string): Promise<Result<User, "NotFound" | "DataError">> => {
  return { Ok: { value: user } }
  return { Err: { value: "NotFound" } }
  return { Err: { value: "DataError" } }
}

// handle error
const $user = await getUser("foo");
if ($user.Err) { return ... }
const user = $user.Ok.value;

// value or undefined if error
const $user = await getUser("foo");
const user = $user.Ok?.value;

// value or undefined if error (shortest)
const user = (await getUser("foo")).Ok?.value;
```

### `Future<T> -> ::Ready<T> | ::Pending`

Based on Rust's [`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) trait and [`Poll`](https://doc.rust-lang.org/std/task/enum.Poll.html) enum.

```tsx
import "unenum/future"; // global
import type { Future } from 'unenum'; // imported
```

```tsx
const useRemoteUser = async (name: string): Future<Result<User, "NotFound" | "DataError">> => {
  return { Pending: true }
  const $user = { Ok: { value: user } }
  const $user = { Err: { value: "NotFound" } }
  return { Ready: $user }
}

// handle pending and error
const $userData = useRemoteUserData("foo");
if ($userData.Pending) { return <Loading />; }
const $user = $userData.Ready.value;
if ($user.Err) { return <Error />; }
const user = $user.Ok.value;
return <View user={user} />;

// value or undefined if pending
const $userData = useRemoteUserData("foo");
const $user = $user.Ready?.value;

// value or undefined if pending (shortest)
const $user = useRemoteUserData("foo").Ready?.value;

// value or undefined if pending or if ready with error
const user = useRemoteUserData("foo").Ready?.value?.Ok?.value;
```

## Utils

### `safely(fn) -> Result`

Executes a given function and returns a `Result`:
- `::Ok`, with the function's inferred `return` value,
- `::Err`, with `unknown` of any potentially `thrown` errors.

```tsx
import { safely } from 'unenum/fns'; // runtime
```

```tsx
const result = safely(() => fn(...))
const data = result?.Ok.value

const result = await safely(async () => (await fn(...)))
const data = result?.Ok.value
```
