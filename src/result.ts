import type { Enum } from "./enum";

// https://doc.rust-lang.org/std/result/enum.Result.html
export type Result<OK = unknown, ERR = unknown> = Enum<{
	Ok: OK;
	Err: ERR;
}>;
