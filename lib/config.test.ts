import { afterEach, describe, expect, it } from "vitest";

import { getOverflowRoomUrl } from "@/lib/config";

const originalDemoUrl = process.env.DEMO_JOIN_URL;
const originalOverflowUrl = process.env.OVERFLOW_ROOM_URL;

afterEach(() => {
  if (originalDemoUrl) process.env.DEMO_JOIN_URL = originalDemoUrl;
  else delete process.env.DEMO_JOIN_URL;
  if (originalOverflowUrl) process.env.OVERFLOW_ROOM_URL = originalOverflowUrl;
  else delete process.env.OVERFLOW_ROOM_URL;
});

describe("getOverflowRoomUrl", () => {
  it("returns no room when neither URL is configured", () => {
    delete process.env.DEMO_JOIN_URL;
    delete process.env.OVERFLOW_ROOM_URL;

    expect(getOverflowRoomUrl()).toBeUndefined();
  });

  it("uses the existing demo room when no overflow room is set", () => {
    process.env.DEMO_JOIN_URL = "https://meet.google.com/landing";
    delete process.env.OVERFLOW_ROOM_URL;

    expect(getOverflowRoomUrl()).toBe("https://meet.google.com/landing");
  });
});
