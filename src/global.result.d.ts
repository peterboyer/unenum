import type { Result as _Result } from "./result";

declare global {
	// @ts-expect-error Clash with global.d.ts.
	export { _Result as Result };
}
