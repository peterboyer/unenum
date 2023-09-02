import type { Result as _Result } from "./default";

declare global {
	// @ts-expect-error Duplicates don't exist for consumer.
	export { _Result as Result };
}
