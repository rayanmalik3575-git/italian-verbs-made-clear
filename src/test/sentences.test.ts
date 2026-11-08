import { describe, expect, it } from "vitest";
import { BUILD_TASKS, isAcceptedOrder } from "@/data/sentences";

describe("sentence builder", () => {
  const cinema = BUILD_TASKS[2]!;
  it("accepts a time block at the start or the end", () => {
    expect(isAcceptedOrder(cinema, ["stasera", "vado", "al cinema"])).toBe(true);
    expect(isAcceptedOrder(cinema, ["vado", "al cinema", "stasera"])).toBe(true);
  });
  it("rejects a description placed before the noun", () => {
    expect(isAcceptedOrder(BUILD_TASKS[1]!, ["mangiamo", "grande", "una pizza"])).toBe(false);
  });
});
