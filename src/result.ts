import type { Enum } from "./enum";

// https://doc.rust-lang.org/std/result/enum.Result.html
type Result<OK = unknown, ERR = unknown> = Enum<{
	Ok: OK;
	Err: ERR;
}>;

export type { Result };
