import type { Expect, Equal } from "./shared/tests";
import type { Async } from "./async";
import type { Result } from "./result";

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
