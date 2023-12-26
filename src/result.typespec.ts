import type { Expect, Equal } from "./shared/tests.js";
import type { Result } from "./result.js";

({}) as [
	Expect<
		Equal<
			Result,
			| { _type: "Ok"; value?: never; error?: never }
			| { _type: "Error"; value?: never; error?: never }
		>
	>,
	Expect<
		Equal<
			Result<unknown>,
			| { _type: "Ok"; value: unknown; error?: never }
			| { _type: "Error"; value?: never; error?: never }
		>
	>,
	Expect<
		Equal<
			Result<unknown, unknown>,
			| { _type: "Ok"; value: unknown; error?: never }
			| { _type: "Error"; value?: never; error: unknown }
		>
	>
];
