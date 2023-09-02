<div align="center">

# unenum

**A type-only Enum/ADT mechanism for TypeScript with no runtime requirements.**

[Overview](#overview) • [Installation](#installation) •
    [`Enum`](#enumtvariants) • [`Result`](#resulttvalue-terror) •
    [`Future`](#futuretvalue) • [`match`](#matchvalue-matcher---) •
    [`safely`](#safelyfn---result) • [Patterns](#patterns)

</div>

<br />

## Overview

- TypeScript's native `enum` keyword is:
    - [**limited**](https://www.typescriptlang.org/docs/handbook/enums.html#const-enum-pitfalls)
        (Enums | Const/Enum Pitfalls | TypeScript Handbook);
    - [**misused**](https://bluepnume.medium.com/nine-terrible-ways-to-use-typescript-enums-and-one-good-way-f9c7ec68bf15)
        (Nine terrible ways to use TypeScript enums, and one good way. | Daniel Brain | Medium);
    - [**redundant**](https://www.youtube.com/watch?v=jjMbPt_H3RQ)
        (Enums considered harmful | Matt Pocock | YouTube);
    - [**replaceable**](https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums)
        with an object with `as const`.

- **Introducing `unenum`**, TypeScript's missing enum mechanism that:
    - feels like a native [utility
        type](https://www.typescriptlang.org/docs/handbook/utility-types.html);
    - has no dependencies (extremely lightweight);
    - has no runtime impact (completely compiled away, no runtime or bundle size cost);
    - can express enums as [algebraic data
        types](https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(algebraic_data_type))
        (ADTs) with data per variants;

```diff ts
- enum Option {
-   None = "None", // ! unit-only variant
-   Some = "Some", // ! unit-only variant
- }

import type { Enum } from "unenum";

type Option = Enum<{
  None: true;              // unit variant
  Some: { data: unknown }; // data variant
}>

- const none: Option = Option.None;
- const some: Option = Option.Some;
- const someData: unknown = "foobar"; // ! unable to include data within option

const none: Option = { is: "None" };
const some: Option = { is: "Some", data: "foobar" }; // able to include option data

- const option: Option = ...;
- if (option === Option.None) { ... }
- if (option === Option.Some && someData) { use(someData) } // ! hanging data value

const option: Option = ...;
if (option.is === "None") { ... }
if (option.is === "Some") { use(option.data) } // access option data after narrowing
```

<br />

`unenum`'s `Enum` is a type generic for building [discriminated
unions](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions)
that feels _like a pattern_ rather than a _library_:

- **`Enum`s are defined as `type` statements**; no factory functions.
- **`Enum`s are instantiated as plain objects `{ ... }`**; no constructors.
- **`Enum`s can be consumed (and narrowed) with plain control flow
statements**; no runtime utilities needed.

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

### For Applications ([Global](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html)):

- Use `Enum` and other type primitives from your project's global namespace.
- Optional runtime utilities will need to be imported as needed, as per below.
- You can add only certain type primitives by suffixing the `global.*` as needed.

```ts
import "unenum/global";        // all
import "unenum/global.enum";   // only Enum
import "unenum/global.result"; // only Result
import "unenum/global.future"; // only Future
```

### For Libraries ([Imported](https://www.typescriptlang.org/docs/handbook/2/modules.html#import-type)):

- Use `Enum`, other type primitives, and optional runtime utilities by
importing as needed.

```ts
import type { Enum, Result, Future } from "unenum"; // zero bundle impact
import { match, safely } from "unenum";             // non-zero bundle impact
```

<br />

## API

### `Enum<TVariants>`

Creates a union of mutually exclusive, discriminable variants.

```ts
import "unenum/global";
import "unenum/global.enum";
import type { Enum } from "unenum";

type Foo = Enum<{
  A: true;
  B: { b: string };
  C: { c: number };
}>;
-> | { is: "A" }
   | { is: "B"; b: string }
   | { is: "C"; c: number }
```

#### `Enum.Keys<TEnum>`

Infers all variants' keys of the given Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Keys<Foo>
-> "A" | "B" | "C"
```

#### `Enum.Infer<TEnum>`

Infers all variants' unit and data definitions of the given Enum.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Infer<Foo>
-> { A: true; B: { b: string }; C: { c: number } }
```

#### `Enum.Pick<TEnum, TVariantKeys>`

Narrows a given Enum by including only the given variants by key.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Pick<Foo, "A" | "C">
-> | { is: "A" }
   | { is: "C"; c: number }
```

#### `Enum.Omit<TEnum, TVariantKeys>`

Narrows a given Enum by excluding only the given variants by key.

```ts
type Foo = Enum<{ A: true; B: { b: string }; C: { c: number } }>;

Enum.Omit<Foo, "A" | "C">
-> | { is: "B"; b: string }
```

#### `Enum.Merge<TEnums>`

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

#### `Enum.Extend<TEnum, TVariants>`

Merges additional variants and properties into a single Enum.

Equivalent to `Enum.Merge<TEnum | Enum<TVariants>>`.

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

<br />

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

#### Example

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

#### Example

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

#### Example

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

### `match(value, matcher) -> ...`

Uses a given `Enum` `value` to execute its corresponding variants' `matcher`
function and return its result. Use `match.partial(...)` if you want to match
against only a subset of variants.

```ts
import { match } from "unenum"; // dependency

type Foo = Enum<{ A: undefined; B: { b: string }; C: { c: number } }>;
const foo: Foo = ...

// exhaustive
match(foo, {
  A: () => null,
  B: ({ b }) => b,
  C: ({ c }) => c,
})
-> null | string | number

// default case
match.partial(foo, {
  A: () => null,
  B: ({ b }) => b,
  _: () => undefined,
})
-> null | string | undefined
```

<br />

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

### With `match` function (optional)

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
