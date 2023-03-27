# unenum

0kb, ergonomic, Rust-like ADT enums for TypeScript.

```
type WebEvent = Enum<{
	// A unit-like variant.
	PageLoad?: void;
	PageUnload?: void;
	// A variant with a value.
	KeyPress: string;
	Paste: string;
	Click: { x: number; y: number; };
}>
```

For Applications (Global):

```
import "unenum/enum";
```

For Libraries (Imported):

```
import type { Enum } from 'unenum';
```

```ts
// typescript
type Result<T, E> =
	| { Ok: T }
	| { Err: E };

// rust
enum Result<T, E> {
	Ok(T),
	Err(E),
}

// typescript
function foo(): Result<number, string> {
	return { Ok: 420 }
	return { Err: "Oops." }
}

// rust
fn foo() -> Result<i32, &str> {
	return Ok(420);
	return Err("Oops.")
}

// typescript
function main() {
	const result = foo()

	// narrow
	if ("Err" in result) {
		return result.Err; // string
	}

	return result.Ok; // number
}

// rust
fn main() {
	let result = foo()

	match result {
		Err(e) => e // &str
		Ok(v) => v // i32
	}

	// narrow
	let value = result?
}

// typescript
throw "unexpected"

// rust
panic!("unexpected")
```

- `throw` is equiv. to Rust's `panic` -- an unrecoverable error.
- `enum` is emulated in typescript via type narrowing and discriminating with `in`

---

https://imhoff.blog/posts/using-results-in-typescript

```ts
export type Result<T, E = Error> =
	| { ok: true; value: T }
	| { ok: false; error: E };
```

- [good] result type stays as type-only

- boolean discrimination on "ok"
- not uniform to other enum/variants with 3+ variants
  - (i.e. Pending/Rejected/Resolved)

---

https://ctidd.com/2018/typescript-result-type

```ts
type Result<T> = T | Error;
```

- error variant is forced as Error
- T as unknown will destroy type check
- no variants or safe discrimination possible

```ts
const ok = <T>(r: Result<T>): r is T => !(r instanceof Error);
```

---

https://github.com/vultix/ts-results
https://blog.logrocket.com/improve-error-handling-typescript-exhaustive-type-checking/

```ts
import { Ok, Err, Result } from "ts-results";

return new Ok(readFileSync(path)); // new is optional here
return new Err("invalid path"); // new is optional here

import { Option, Some, None } from "ts-results";

function getLoggedInImage(): Option<string>;
const optionalUrl = getLoggedInImage();
if (optionalUrl.some) {
	const url: URL = optionalUrl.val;
}
```

- runtime dependent
- type narrows on `ok` of Result
- type narrows on `some` of Option

```ts
let result: Result<number, Error> = Ok(1);

if (result.ok)
if (result.err)
```

---

https://github.com/badrap/result

- runtime dependent

```ts
import { Result } from "@badrap/result";

const res = Result.ok(1);
res.isOk; // true

const res = Result.err(new Error());
res.isOk; // false

const res = Result.err(); // functionally equal to Result.err(new Error())
res.isOk; // false
```

---

https://dev.to/duunitori/mimicing-rust-s-result-type-in-typescript-3pn1

```ts
export type Result<T, E> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  public constructor(public readonly value: T) {}
  public isOk(): this is Ok<T, E> {
  public isErr(): this is Err<T, E> {
}

export class Err<T, E> {
  public constructor(public readonly error: E) {}
  public isOk(): this is Ok<T, E> {
  public isErr(): this is Err<T, E> {
}

export const ok = <T, E>(value: T): Ok<T, E> => new Ok(value);
export const err = <T, E>(error: E): Err<T, E> => new Err(error);
```

- runtime dependent
- classes

---

https://github.com/everweij/typescript-result

```ts
import { Result } from "typescript-result";

return Result.ok(stuff);
return Result.error(e);

if (result.isSuccess()) {
```

- runtime dependent
- discriminates on `.isSuccess`, limited to boolean of enum/variants

---

https://swan-io.github.io/boxed/

```ts
import { AsyncData } from "@swan-io/boxed";

const UserCard = ({ user }: { user: AsyncData<User> }) => {
	return user.match({
		NotAsked: () => null,
		Loading: () => `Loading`,
		Done: (user) => {
			const name = user.name.getWithDefault("anonymous");
			return `Hello ${name}!`;
		},
	});
};
```

- runtime dependent

```ts
import { Result } from "@swan-io/boxed";

const ok = Result.Ok(1);

const notOk = Result.Error("something happened");
```

---

https://github.com/gvergnaud/ts-pattern
https://dev.to/gvergnaud/bringing-pattern-matching-to-typescript-introducing-ts-pattern-v3-0-o1k

- runtime
- is a pattern matching construct
- example Result uses discriminant `type: "error"|"ok"` to pattern match

```ts
import { match, P } from 'ts-pattern';

type Data =
  | { type: 'text'; content: string }
  | { type: 'img'; src: string };

type Result =
  | { type: 'ok'; data: Data }
  | { type: 'error'; error: Error };

const result: Result = ...;

return match(result)
  .with({ type: 'error' }, () => `<p>Oups! An error occured</p>`)
  .with({ type: 'ok', data: { type: 'text' } }, (res) => `<p>${res.data.content}</p>`)
  .with({ type: 'ok', data: { type: 'img', src: P.select() } }, (src) => `<img src=${src} />`)
  .exhaustive();
```

- wildcard pattern matching beyond enum/variant

```ts
import { match, __ } from 'ts-pattern';

match([state, event])
  .with(__, () => state)
  // You can also use it inside another pattern:
  .with([__, { type: 'success' }], ([_, event]) => /* event: { type: 'success', data: string } */)
  // at any level:
  .with([__, { type: __ }], () => state)
  .exhaustive();
```

https://github.com/bdsqqq/try

- errors are unknown
- makes unexpected errors the problem of every call site
- could use safely for sync/async support wrapped into a result type

https://github.com/thelinuxlich/go-go-try

- same problems as trytm

https://github.com/lukemorales/exhaustive
