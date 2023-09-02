import type { Future as _Future } from "./default";

declare global {
	// @ts-expect-error Duplicates don't exist for consumer.
	export { _Future as Future };
}
