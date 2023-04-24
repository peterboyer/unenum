import type { Expect, Equal } from "./testutils";
import type { Result } from "./result";

({}) as [
	Expect<
		Equal<
			Result,
			| { is: "Ok"; value: unknown; error?: never }
			| { is: "Error"; error: unknown; value?: never }
		>
	>,
	Expect<
		Equal<
			Result<never>,
			| { is: "Ok"; value: never; error?: never }
			| { is: "Error"; error: unknown; value?: never }
		>
	>,
	Expect<
		Equal<
			Result<unknown>,
			| { is: "Ok"; value: unknown; error?: never }
			| { is: "Error"; error: unknown; value?: never }
		>
	>,
	Expect<
		Equal<
			Result<never, never>,
			| { is: "Ok"; value: never; error?: never }
			| { is: "Error"; error: never; value?: never }
		>
	>,
	Expect<
		Equal<
			Result<unknown, unknown>,
			| { is: "Ok"; value: unknown; error?: never }
			| { is: "Error"; error: unknown; value?: never }
		>
	>
];
