import type { Equal, Expect } from "./testing.js";
import { Enum } from "./enum.js";

describe("Enum.is", () => {
	test("Default", () => {
		type Event = Enum<{
			Open: true;
			Data: { value: unknown };
			Close: true;
		}>;

		const Event = Enum.builder({} as Event);
		const event = {} as Event;

		{
			if (Enum.is(event, "Open")) {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Open">>>];
			} else if (Enum.is(event, "Data")) {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Data">>>];
			} else {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Close">>>];
			}
		}

		{
			if (Enum.is(event, ["Open", "Close"])) {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Open" | "Close">>>,
				];
			} else {
				({}) as [Expect<Equal<typeof event, Enum.Pick<Event, "Data">>>];
			}
		}

		{
			const event = Event.Open() as Event;
			expect(Enum.is(event, "Open")).toEqual(true);
			expect(Enum.is(event, "Data")).toEqual(false);
			expect(Enum.is(event, ["Open", "Close"])).toEqual(true);
			expect(Enum.is(event, ["Data", "Close"])).toEqual(false);
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

		const Event = Enum.builder_({} as Event, "custom");
		const event = {} as Event;

		{
			if (Enum.is_(event, "custom", "Open")) {
				({}) as [
					Expect<Equal<typeof event, Enum.Pick<Event, "Open", "custom">>>,
				];
			} else if (Enum.is_(event, "custom", "Data")) {
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
			if (Enum.is_(event, "custom", ["Open", "Close"])) {
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
			expect(Enum.is_(event, "custom", "Open")).toEqual(true);
			expect(Enum.is_(event, "custom", "Data")).toEqual(false);
			expect(Enum.is_(event, "custom", ["Open", "Close"])).toEqual(true);
			expect(Enum.is_(event, "custom", ["Data", "Close"])).toEqual(false);
		}
	});
});
