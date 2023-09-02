import type { Expect, Equal } from "./testutils";
import type { Result } from "./default";

({}) as [
	Expect<
		Equal<
			Result,
			| {
					is: "Ok";
			  }
			| {
					is: "Error";
			  }
		>
	>,
	Expect<
		Equal<
			Result<unknown>,
			| {
					is: "Ok";
					value: unknown;
			  }
			| {
					is: "Error";
			  }
		>
	>,
	Expect<
		Equal<
			Result<unknown, unknown>,
			| {
					is: "Ok";
					value: unknown;
			  }
			| {
					is: "Error";
					error: unknown;
			  }
		>
	>
];
