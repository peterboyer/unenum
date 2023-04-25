<div align="center">

# unenum

**A 0kb, Rust-like Enum/ADT mechanism for TypeScript with zero runtime
requirements.**

[Overview](#overview) • [Installation](#installation) • [`Enum`](#enumvariants) •
[`Result`](#resultvalue-error) • [`Future`](#futurevalueorenum) • [`safely`](#safelyfn---result) • [`match`](#matchvalue-matcher---)

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

Here's an example of `unenum`'s [`Enum`](#enumvariants) compared with Rust's
[`enum`](https://doc.rust-lang.org/rust-by-example/custom_types/enum.html):

<table width="100%">
<tr>
<td>
<pre lang="ts">// TypeScript
 
type WebEvent = Enum<{
	// Unit
	PageLoad: undefined;
	PageUnload: undefined;
	// Tuple (not practical; use object instead)
	KeyPress: { key: string };
	Paste: { content: string };
	// Object
	Click: { x: number; y: number };
}>
 
const event: WebEvent = { is: "PageLoad" };
const event: WebEvent = { is: "PageUnload" };
const event: WebEvent = { is: "KeyPress", key: "x" };
const event: WebEvent = { is: "Paste", content: "..." };
const event: WebEvent = { is: "Click", x: 10, y: 10 };
 
function inspect(event: WebEvent) {
 
	if (event.is === "PageLoad") console.log(event);
	else if (event.is === "PageUnload") console.log(event);
	else if (event.is === "KeyPress") console.log(event, event.key);
	else if (event.is === "Paste") console.log(event, event.content);
	else if (event.is === "Click") console.log(event, event.x, event.y);
 
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
}
 
let event = WebEvent::PageLoad;
let event = WebEvent::PageUnload;
let event = WebEvent::KeyPress('x')
let event = WebEvent::Paste("...".to_owned());
let event = WebEvent::Click { x: 10, y: 10 };
 
fn inspect(event: WebEvent) {
	match event {
		WebEvent::PageLoad => println!(event),
		WebEvent::PageUnload => println!(event),
		WebEvent::KeyPress(c) => println!(event, c),
		WebEvent::Paste(s) => println!(event, s),
		WebEvent::Click { x, y } => println!(event, x, y),
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
import type { Enum, ... } from "unenum";
```

<br />

## `Enum<Variants>`

Creates a union of mutually exclusive, discriminable variants.

```ts
import "unenum/global.enum"; // global
import type { Enum } from "unenum"; // imported

type Foo = Enum<{
	A: undefined;
	B: { b: string };
	C: { c: number };
}>;
-> | { is: "A" }
   | { is: "B"; b: string }
   | { is: "C"; c: number }
```

### `Enum.Keys<Enum>`

Infers all possible variants' keys of the given Enum.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;

Enum.Keys<Foo>
-> "A" | "B" | "C"
```

### `Enum.Values<Enum>`

Infers all possible variants' values of the given Enum.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;

Enum.Values<Foo>
-> | { b: string }
   | { c: number }
```

### `Enum.Props<Enum, All?>`

Infers only _common_ variants' properties' names of the given Enum. If `All` is
`true`, then _all_ variants' properties' names are inferred.

```ts
type Foo = Enum<{ A: undefined; B: { x: string }; C: { x: string; y: number } }>;

Enum.Props<Foo>
-> "x"

Enum.Props<Foo, true>
-> "x" | "y"
```

### `Enum.Pick<Enum, VariantKeys>`

Narrows a given Enum by including only the given variants by key.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;

Enum.Pick<Foo, "A" | "C">
-> | { is: "A" }
   | { is: "C"; c: number }
```

### `Enum.Omit<Enum, VariantKeys>`

Narrows a given Enum by excluding only the given variants by key.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;

Enum.Omit<Foo, "A" | "C">
-> | { is: "B"; b: string }
```

<br />

## Patterns

### `If` Statement Narrowing

Using `if` statements to discriminate between `Enum` variants.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;
const foo: Foo = { ... };

foo -> A | B | C
if (foo.is === "A") {
	return doSomethingWithA(foo);
}

foo -> B | C
if (foo.is === "B") {
	return doSomethingWithB(foo);
} else {
	return doSomethingWithC(foo);
}

foo -> never
```

### Ternary Expressions

Using ternaries to discriminate between `Enum` variants resulting in a value,
similar to Rust `match` statements.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;
const foo: Foo = { ... };

const bar = (
	foo.is === "A"
		? 123
	: foo.is === "B"
		? "abc"
	: null
);

bar -> number | string | null
```

### Switch Statements

Discriminating on `is` to narrow cases.

```ts
type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;
const foo: Foo = { ... }

switch (foo.is) {
	case "A": {
		return doSomethingWithA(foo);
	}
	default: {
		return doSomethingWithBOrC(foo);
	}
}
```

## Included Enums

### `Result<Value?, Error?>`

Represents either success `value` (`Ok`) or failure `error` (`Error`).

_`Result` uses `value?: never` and `error?: never` to allow for shorthand access
to `.value` or `.error` if you want to safely default to `undefined` if either
property is not available._

```ts
import "unenum/global.result"; // global
import type { Result } from "unenum"; // imported

Result
-> | { is: "Ok"; value: unknown; error?: never }
   | { is: "Error"; error: unknown; value?: never }

Result<number>
-> | { is: "Ok"; value: number; error?: never }
   | { is: "Error"; error: unknown; value?: never }

Result<number, "FetchError">
-> | { is: "Ok"; value: number; error?: never }
   | { is: "Error"; error: "FetchError"; value?: never }
```

```ts
const getUser = async (name: string): Promise<Result<User, "NotFound">> => {
	return { is: "Ok", value: user };
	return { is: "Error", error: "NotFound" };
}

const $user = await getUser("foo");
if ($user.is === "Error") { return ... }
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

> **Note**
>
> You may find it useful to name container-like `Enum` values (e.g. of
> `Result`s and `Future`s) with a `$` prefix (e.g. `$user`) before unwrapping
> the desired value into non-prefixed value (e.g. `const user = $user.value`).

<br />

### `Future<ValueOrEnum?>`

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
   | { is: "Error"; error: unknown; value?: never }
```

```tsx
const useRemoteUser = (name: string): Future<Result<User, "NotFound">> => {
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
const userOrUndefined = $user.value;
const userOrUndefined = $user.is === "Ok" ? $user.value : undefined;

const $user = useRemoteUser("foo");
const userOrDefault = $user.value ?? defaultUser;
const userOrDefault = $user.is === "Ok" ? $user.value : defaultUser;
```

Based on Rust's
[`Future`](https://doc.rust-lang.org/std/future/trait.Future.html) trait and
[`Poll`](https://doc.rust-lang.org/std/task/enum.Poll.html) enum.

<br />

## Utils

### `safely(fn) -> Result`

Executes a given function and returns a `Result` that wraps its normal return
value as `Ok` and any thrown errors as `Error`. Supports async/`Promise`
returns.

```ts
import { safely } from "unenum"; // runtime

safely(() => JSON.stringify(...))
-> Result<string>

safely(() => JSON.parse(...))
-> Result<unknown>

safely(() => fetch("/endpoint").then(res => res.json() as Data))
-> Promise<Result<Data>>
```

### `match(value, matcher) -> ...`

Uses a given `Enum` `value` to execute its corresponding variant's `matcher`
function and return its result. Use `match.orUndefined(...)` or
`match.orDefault(...)` if you want to match with only a subset of variants.

```ts
import { match } from "unenum"; // runtime

type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;
const foo: Foo = ...

// all cases
match(foo, {
	A: () => null,
	B: ({ b }) => b,
	C: ({ c }) => c,
})
-> null | string | number

// some cases or undefined
match.orUndefined(foo, {
	A: () => null,
	B: ({ b }) => b,
})
-> null | string | undefined

// some cases or default
match.orDefault(
	foo,
	{ A: () => null },
	($) => $.is === "B" ? true : false
)
-> null | string | boolean
```
