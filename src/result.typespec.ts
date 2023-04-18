import type { Expect, Equal } from "./testutils";
import type { Result } from "./result";

({}) as [
	Expect<
		Equal<Result, { is: "Ok"; value: unknown } | { is: "Err"; error: unknown }>
	>,
	Expect<
		Equal<
			Result<never>,
			{ is: "Ok"; value: never } | { is: "Err"; error: unknown }
		>
	>,
	Expect<
		Equal<
			Result<unknown>,
			{ is: "Ok"; value: unknown } | { is: "Err"; error: unknown }
		>
	>,
	Expect<
		Equal<
			Result<never, never>,
			{ is: "Ok"; value: never } | { is: "Err"; error: never }
		>
	>,
	Expect<
		Equal<
			Result<unknown, unknown>,
			{ is: "Ok"; value: unknown } | { is: "Err"; error: unknown }
		>
	>
];
