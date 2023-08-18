<div align="center">

# unenum

**A 0kb, Rust-like Enum/ADT mechanism for TypeScript with zero runtime
requirements.**

[Overview](#overview) • [Installation](#installation) •
    [`Enum`](#enumtvariants) • [Patterns](#patterns) •
    [`Result`](#resulttvalue-terror) • [`Future`](#futuretvalue) •
    [`safely`](#safelyfn---result) • [`match`](#matchvalue-matcher---)

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
- **`Enum` variants can define custom per-instance data**; impossible with
  native TypeScript `enum`s.

<br />

`unenum` aims to _feel_ like a native TypeScript utility type, _like a
pattern_, rather than a library:

- **`Enum`s are defined as `type` statements**; instead of factory functions.
- **`Enum`s are instantiated with plain object `{ ... }` syntax**; instead of
  constructors.
- **`Enum`s can be consumed (and narrowed) with plain `if` statements**;
  instead of imported match utilities.

<br />

Here's an example of `unenum`'s [`Enum`](#enumtvariants) compared with Rust's
[`enum`](https://doc.rust-lang.org/rust-by-example/custom_types/enum.html):

<table width="100%">
<tr>
<td>
<pre lang="ts">// TypeScript
 
type WebEvent = Enum<{
  PageLoad: true;
  PageUnload: true;
  KeyPress: { key: string };
  Paste: { content: string };
  Click: { x: number; y: number };
}>
 
const event: WebEvent = { is: "PageLoad" };
const event: WebEvent = { is: "PageUnload" };
const event: WebEvent = { is: "KeyPress", key: "x" };
const event: WebEvent = { is: "Paste", value: "..." };
const event: WebEvent = { is: "Click", x: 10, y: 10 };
 
function inspect(event: WebEvent) {
 
  if (event.is === "PageLoad") console.log(event);
  else if (event.is === "PageUnload") console.log(event);
  else if (event.is === "KeyPress") console.log(event.key);
  else if (event.is === "Paste") console.log(event.value);
  else if (event.is === "Click") console.log(event.x, event.y);
 
}
</pre></td>

<td>
<pre lang="rust">// Rust
 
enum WebEvent {
  PageLoad,
  PageUnload,
  KeyPress(char),
  Paste(String),
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
    WebEvent::KeyPress(key) => println!(key),
    WebEvent::Paste(value) => println!(value),
    WebEvent::Click { x, y } => println!(x, y),
  }
}
</pre></td>

</table>

<br />

## Installation

[![Version](https://img.shields.io/npm/v/unenum?label=version)](https://www.npmjs.com/package/unenum/)
[![License](https://img.shields.io/npm/l/unenum)](./LICENSE)

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

## `Enum<TVariants>`

Creates a union of mutually exclusive, discriminable variants.

```ts
import "unenum/global.enum"; // global
import type { Enum } from "unenum"; // imported

// Default
type Foo = Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
}>;
-> | { is: "A" }
   | { is: "B"; b: string }
   | { is: "C"; c: number }

// Enum with Custom Discriminant
type MyFoo = Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
}, "$key">;
-> | { $key: "A" }
   | { $key: "B"; b: string }
   | { $key: "C"; c: number }

// Enum Generic with Custom Discriminant
import type { EnumVariants } from "unenum"
type MyEnum<TVariants extends EnumVariants> = Enum<TVariants, "$key">
```

### `Enum.Pick<TEnum, TVariantKeys>`

Narrows a given Enum by including only the given variants by key.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Pick<Foo, "A" | "C">
-> | { is: "A" }
   | { is: "C"; c: number }
```

### `Enum.Omit<TEnum, TVariantKeys>`

Narrows a given Enum by excluding only the given variants by key.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Omit<Foo, "A" | "C">
-> | { is: "B"; b: string }
```

### `Enum.Merge<TEnums>`

Merges a given union of Enums' variants and properties into a single Enum.

```ts
Enum.Merge<
   | Enum<{ A: true; B: true; C: { c1: string } }>
   | Enum<{ B: { b1: string }; C: { c2: number }; D: true }>
>
-> Enum<{
  A: true;
  B: { b1: string };
  C: { c1: string; c2: number };
  D: true;
}>
```

### `Enum.Extend<TEnum, TVariants>`

Merges additional variants and properties into a single Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Extend<Foo, { D: true }>
-> Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
  D: true;
}>
```

### `Enum.Unwrap<TEnum>`

Infers all variants' unit and data definitions of the given Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Unwrap<Foo>
-> | { A: true; B: { b: string }; C: { c: number } }
```

### `Enum.Keys<TEnum>`

Infers all variants' keys of the given Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Keys<Foo>
-> "A" | "B" | "C"
```

### `Enum.Values<TEnum>`

Infers all variants' values of the given Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Values<Foo>
-> | { b: string }
   | { c: number }
```

### `Enum.Props<TEnum, TAll?>`

Infers only mutual variants' properties' names of the given Enum. If `TAll` is
`true`, then all variants' properties' names are inferred.

```ts
type Foo = Enum<{ A: true; B: { x: string }; C: { x: string; y: number } }>;

Enum.Props<Foo>
-> "x" // only `x` is mutual in both B and C

Enum.Props<Foo, true>
-> "x" | "y" // now `y` is included because `TAll` is `true`
```

<br />

## Patterns

`Enum`s are [disciminated
unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
that uses a discriminant (default `is`) as a property to differentiate between
variants. TypeScript uses [type
narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) to
analyse control flow statements like `if` and `return` to determine when
certain `Enum` variants are accessible, allowing for safe property access.

If a function's return type is not explicitly annotated it will be inferred
instead, which _will_ lead to inaccurate `Enum` return types. Explicitly
specifying an `Enum` (e.g. `Foo`) as a return type will ensure that a function
returns a valid `Enum` variant and provides autocompletion to help instantiate
`Enum` variants with all their properties (e.g. `return { is: "B", b: "..."
}`).

> **Note**
>
> If you want to annotate only a subset of possible `Enum` variants of an
> existing `Enum` type, use
> [`Enum.Pick`](#enumpicktenum-tvariantkeys) or
> [`Enum.Omit`](#enumomittenum-tvariantkeys).

### With explicit return types (recommended)

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

function getFoo(value: string | number): Foo {
  if (!value {
    return { is: "A" };
  }

  if (typeof value === "string") {
    return { is: "B", b: value };
  }

  return { is: "C", c: value };
}
```

> **Note**
>
> You may find it useful to name variables for container-like `Enum`s (like
> `Result`s and `Future`s) with a `$` prefix (e.g. `$user`) before unwrapping
> the desired value into non-prefixed value (e.g. `const user = $user.value`).

### With `if` statements (recommended)

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;
const foo: Foo = { ... };

if (foo.is === "A") {
  return 123;
}

if (foo.is === "B") {
  return foo.b === "" ? "empty" : "abc";
}

return null;
```

> **Note**
>
> `if` statements are the most universal and native way to handle `Enum`
> variants without any dependencies.

### With `match` function (runtime dependency)

See [`match`](#matchvalue-matcher---).

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;
const foo: Foo = { ... };

import { match } from "unenum";
match(foo, {
  A: () => 123,
  B: ({ b }) => b === "" ? "empty" : "abc",
  C: () => null,
});
```

> **Note**
>
> Using the `match` utility will make `unenum` a runtime dependency with a
> non-0kb bundle-size cost instead of being a type-only utility. However,
> `match` is tiny and very helpful for reducing complexity of conditional
> variable assignments instead of needing to write one-off functions,
> [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)s, or ternary
> expressions.

### With ternary expressions

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;
const foo: Foo = { ... };

foo.is === "A"
  ? 123
: foo.is === "B"
  ? (foo.b === "" ? "empty" : "abc")
: null;
```

> **Note**
>
> Ternary expressions are often criticised for poor readibility, where
> sufficiently complex and nested expression (such as the above example) are
> strong candidates for refactoring into functions that may use `if` statements
> and the early-return pattern to cleanly narrow down an `Enum`'s variants.

### With `switch` statements

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;
const foo: Foo = { ... }

switch (foo.is) {
  case "A": {
    return 123;
  }
  case "B": {
    return foo.b === "" ? "empty" : "abc";
  }
  default: {
    return null;
  }
}
```

> **Note**
>
> `switch` statements are severely limited because they can only branch based on
> an `Enum`'s `is` variant discriminant. `if` statements allow for more
> versitile conditional expressions that may accomodate evaluating other
> variables or even properties on the `Enum` variant itself (e.g. `if (foo.is
> === "B" && foo.b === "hello") ...`).

## Included Enums

### `Result<TValue?, TError?>`

Represents either a success `value` (`Ok`) or a failure `error` (`Error`).

```ts
import "unenum/global.result"; // global
import type { Result } from "unenum"; // imported

Result
-> | { is: "Ok" }
   | { is: "Error" }

Result<number>
-> | { is: "Ok"; value: number }
   | { is: "Error" }

Result<number, "FetchError" | "ConnectionError">
-> | { is: "Ok"; value: number }
   | { is: "Error"; error: "FetchError" | "ConnectionError" }

Result<
  number,
  Enum<{
    "FetchError": true;
    "ConnectionError": true;
    "FormFieldsError": { fieldErrors: Record<string, string> };
  }>
-> | { is: "Ok"; value: number }
   | { is: "Error"; error: | { is: "FetchError" }
                           | { is: "ConnectionError" }
                           | { is: "FormFieldsError"; fieldErrors: ... }}
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
const userOrUndefined = $user.is === "Ok" ? $user.value : undefined;

const $user = await getUser("foo");
const userOrDefault = $user.is === "Ok" ? $user.value : defaultUser;
```

Based on Rust's
[`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) enum.

<br />

### `Future<TValue?>`

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

#### `Future.Enum<TEnum>`

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

<br />

## Utils

### `safely(fn) -> Result`

Executes a given function and returns a `Result` that wraps its normal return
value as `Ok` and any thrown errors as `Error`. Supports async/`Promise`
returns.

```ts
import { safely } from "unenum"; // dependency

safely(() => JSON.stringify(...))
-> Result<string>

safely(() => JSON.parse(...))
-> Result<unknown>

safely(() => fetch("/endpoint").then(res => res.json() as Data))
-> Promise<Result<Data>>
```

### `match(value, matcher) -> ...`

Uses a given `Enum` `value` to execute its corresponding variants' `matcher`
function and return its result. Use `match.orUndefined(...)` or
`match.orDefault(...)` if you want to match against only a subset of variants.

```ts
import { match } from "unenum"; // dependency

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
