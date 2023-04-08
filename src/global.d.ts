import type { Enum as _Enum } from "./enum";
import type { Result as _Result } from "./result";
import type { Future as _Future } from "./future";

declare global {
	// prettier-ignore
	export {
		_Enum as Enum,
		_Result as Result,
		_Future as Future,
	};
}
