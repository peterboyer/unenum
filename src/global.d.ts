import type { Enum as _Enum } from "./enum";
import type { Result as _Result } from "./result";
import type { Future as _Future } from "./future";

declare global {
	// prettier-ignore
	// @ts-expect-error Exporting here is allowed.
	export {
		// @ts-expect-error Clash with global.enum.d.ts.
		_Enum as Enum,
		// @ts-expect-error Clash with global.result.d.ts.
		_Result as Result,
		// @ts-expect-error Clash with global.future.d.ts.
		_Future as Future,
	};
}
