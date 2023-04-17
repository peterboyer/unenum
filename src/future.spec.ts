import type { Expect, Equal } from "./testutils";
import type { Future } from "./future";
import type { Enum } from "./enum";

({}) as [
	Expect<Equal<Future, { is: "Pending" } | { is: "Ready"; value: unknown }>>,
	Expect<Equal<Future<never>, never>>,
	Expect<
		Equal<Future<unknown>, { is: "Pending" } | { is: "Ready"; value: unknown }>
	>,
	Expect<
		Equal<
			Future<Enum<{ Unit: undefined; Data: { value: unknown } }>>,
			{ is: "Pending" } | { is: "Unit" } | { is: "Data"; value: unknown }
		>
	>
];
