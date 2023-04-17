import type { Enum as _Enum } from "./enum";

declare global {
	// @ts-expect-error Clash with global.d.ts.
	export { _Enum as Enum };
}
