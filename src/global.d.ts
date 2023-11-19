import type { Enum as _Enum } from "./enum";
import type { Async as _Async } from "./async";
import type { Result as _Result } from "./result";

declare global {
	// @ts-expect-error Duplicates don't exist for consumer.
	export { _Enum as Enum, _Async as Async, _Result as Result };
}
