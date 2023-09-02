import type {
	Enum as _Enum,
	Result as _Result,
	Future as _Future,
} from "./default";

declare global {
	// @ts-expect-error Duplicates don't exist for consumer.
	export { _Enum as Enum, _Result as Result, _Future as Future };
}
