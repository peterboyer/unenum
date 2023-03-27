/**
 * @private
 * Internal `unenum`-only utils.
 */
export namespace $unenum {
	/**
	 * Get all "required" keys of object.
	 *
	 * @example
	 * ```
	 * RequiredKeys<{ A: string; B: string; C?: string }>
	 * -> "A" | "B"
	 * ```
	 */
	export type RequiredKeys<T extends object> = {
		// eslint-disable-next-line @typescript-eslint/ban-types
		[K in keyof T]-?: {} extends Pick<T, K> ? never : K;
	}[keyof T];

	/**
	 * Create an intersection of all union members.
	 *
	 * @example
	 * ```
	 * Intersect<{ A: string } | { B: string } | { C: string }>
	 * -> { A: string, B: string, C: string }
	 * ```
	 */
	export type Intersect<T extends object> = (
		T extends unknown ? (t: T) => void : never
	) extends (t: infer R) => void
		? R
		: never;
}
