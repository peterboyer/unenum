import type { Async as _Async } from "./async";

declare global {
	// @ts-expect-error Duplicates don't exist for consumer.
	export { _Async as Async };
}
