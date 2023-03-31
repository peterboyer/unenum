import type { Enum } from "./enum";

// https://doc.rust-lang.org/std/result/enum.Result.html
export type Result<T = unknown, E = unknown> = Enum<{
	Ok: { value: T; error?: never };
	Err: { error: E; value?: never };
}>;
