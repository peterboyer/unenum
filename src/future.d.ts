import type { Enum } from "./enum";

/**
 * Represents an asynchronous value that is either loading (`Pending`) or
 * resolved (`Ready`). If given an `Enum` parameter, `Future` will merge
 * only the `Pending` variant with it.
 *
 * @example
 * ```
 * Future<string>
 * -> | { is: "Pending" }
 *    | { is: "Ready", value: string }
 *
 * Future<Result<number>>
 * -> | { is: "Pending" }
 *    | { is: "Ok", value: number }
 *    | { is: "Err", error: unknown }
 *
 * Future<Result<number, "FetchError">>
 * -> | { is: "Pending" }
 *    | { is: "Ok", value: number }
 *    | { is: "Err", error: "FetchError" }
 * ```
 */
// https://doc.rust-lang.org/std/future/trait.Future.html
// https://doc.rust-lang.org/std/task/enum.Poll.html
// prettier-ignore
export type Future<TValueOrEnum = unknown> = TValueOrEnum extends { is: string }
	? TValueOrEnum extends infer TEnum
		? Enum<{ Pending: undefined }> | TEnum
		: never
	: TValueOrEnum extends infer TValue
		? Enum<{ Pending: undefined; Ready: { value: TValue } }>
		: never;
