import type { Expect, Equal } from "./testing.js";
import type { Async } from "./async.js";
import type { Result } from "./result.js";

({}) as [
	Expect<Equal<Async.Pending, { _type: "Pending" }>>,
	Expect<Equal<Async.Pending<string>, { _type: "Pending"; value?: never }>>,
	Expect<Equal<Async.Ready, { _type: "Ready" }>>,
	Expect<Equal<Async.Ready<string>, { _type: "Ready"; value: string }>>,
	Expect<Equal<Async, { _type: "Pending" } | { _type: "Ready" }>>,
	Expect<
		Equal<
			Async<boolean>,
			{ _type: "Pending"; value?: never } | { _type: "Ready"; value: boolean }
		>
	>,
	Expect<
		Equal<
			Async<Result>,
			| { _type: "Pending" }
			| { _type: "Ok"; value?: never; error?: never }
			| { _type: "Error"; value?: never; error?: never }
		>
	>,
];
