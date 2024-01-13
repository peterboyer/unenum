import type { Equal, Expect } from "./testing.js";
import { type Enum, builder, builder_, is, is_ } from "./enum.js";

describe("is", () => {
	test("Default", () => {
		type Event = Enum<{
			Open: true;
			Data: { value: unknown };
			Close: true;
		}>;

		const Event = builder({} as Event);
		const event = {} as Event;

		{
			if (is(event, "Open")) {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Open">>>];
			} else if (is(event, "Data")) {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Data">>>];
			} else {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Close">>>];
			}
		}

		{
			if (is(event, ["Open", "Close"])) {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Open" | "Close">>>,
				];
			} else {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Data">>>];
			}
		}

		{
			const event = Event.Open() as Event;
			expect(is(event, "Open")).toEqual(true);
			expect(is(event, "Data")).toEqual(false);
			expect(is(event, ["Open", "Close"])).toEqual(true);
			expect(is(event, ["Data", "Close"])).toEqual(false);
		}
	});

	test("Custom", () => {
		type Event = Enum<
			{
				Open: true;
				Data: { value: unknown };
				Close: true;
			},
			"custom"
		>;

		const Event = builder_({} as Event, "custom");
		const event = {} as Event;

		{
			if (is_(event, "custom", "Open")) {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Open", "custom">>>,
				];
			} else if (is_(event, "custom", "Data")) {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Data", "custom">>>,
				];
			} else {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Close", "custom">>>,
				];
			}
		}

		{
			if (is_(event, "custom", ["Open", "Close"])) {
				({}) as [
					Expect<
						Equal<typeof event, Enum.Pick<Event, "Open" | "Close", "custom">>
					>,
				];
			} else {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Data", "custom">>>,
				];
			}
		}

		{
			const event = Event.Open() as Event;
			expect(is_(event, "custom", "Open")).toEqual(true);
			expect(is_(event, "custom", "Data")).toEqual(false);
			expect(is_(event, "custom", ["Open", "Close"])).toEqual(true);
			expect(is_(event, "custom", ["Data", "Close"])).toEqual(false);
		}
	});
});
