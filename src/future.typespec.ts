import type { Expect, Equal } from "./testutils";
import type { Future } from "./future";
import type { Enum } from "./enum";
import type { Result } from "./result";

({}) as [
	Expect<
		Equal<
			Future,
			{ is: "Pending"; value?: never } | { is: "Ready"; value: unknown }
		>
	>,
	Expect<
		Equal<
			Future<never>,
			{ is: "Pending"; value?: never } | { is: "Ready"; value: never }
		>
	>,
	Expect<
		Equal<
			Future<unknown>,
			{ is: "Pending"; value?: never } | { is: "Ready"; value: unknown }
		>
	>,
	Expect<
		Equal<
			Future<Enum<{ Unit: undefined; Data: { data: unknown } }>>,
			{ is: "Pending" } | { is: "Unit" } | { is: "Data"; data: unknown }
		>
	>,
	Expect<
		Equal<
			Future<Result<string>>,
			| { is: "Pending"; value?: never; error?: never }
			| { is: "Ok"; value: string; error?: never }
			| { is: "Error"; error: unknown; value?: never }
		>
	>
];
