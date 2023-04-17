import type { Enum } from "./enum";

/**
 * Represents either success (`Ok`) or failure (`Err`).
 *
 * @example
 * ```
 * Result<number>
 * -> | { is: "Ok", value: number }
 *    | { is: "Err", error: unknown }
 * Result<number, "FetchError">
 * -> | { is: "Ok", value: number }
 *    | { is: "Err", error: "FetchError" }
 * ```
 */
// https://doc.rust-lang.org/std/result/enum.Result.html
export type Result<T = unknown, E = unknown> = Enum<{
	Ok: { value: T };
	Err: { error: E };
}>;
