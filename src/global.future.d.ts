import type { Future as _Future } from "./future";

declare global {
	// @ts-expect-error Clash with global.d.ts.
	export { _Future as Future };
}
