import type { Expect, Equal } from "./testutils";
import type { Future } from "./future";
import type { Result } from "./result";

({}) as [
	Expect<
		Equal<
			Future,
			| {
					is: "Pending";
			  }
			| {
					is: "Ready";
			  }
		>
	>,
	Expect<
		Equal<
			Future<unknown>,
			| {
					is: "Pending";
			  }
			| {
					is: "Ready";
					value: unknown;
			  }
		>
	>,
	Expect<
		Equal<
			Future<Result>,
			| {
					is: "Pending";
			  }
			| {
					is: "Ready";
					value:
						| {
								is: "Ok";
						  }
						| {
								is: "Error";
						  };
			  }
		>
	>,
	Expect<
		Equal<
			Future.Enum<Result>,
			| {
					is: "Pending";
			  }
			| {
					is: "Ok";
			  }
			| {
					is: "Error";
			  }
		>
	>
];
