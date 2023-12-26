import type { Expect, Equal } from "./shared/tests.js";
import type { Async } from "./async.js";
import type { Result } from "./result.js";

({}) as [
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
	>
];
