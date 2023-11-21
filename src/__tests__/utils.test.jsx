import { describe, it, expect } from "vitest";
import { aggregateBySchool, calculateBatteryUsage } from "../utils";

describe("calculateBatteryUsage", () => {
  it("should return an empty object for empty data", () => {
    expect(calculateBatteryUsage([])).toEqual({});
  });

  it("should ignore battery level increases", () => {
    const batteryData = [
      {
        serialNumber: "123",
        batteryLevel: 0.5,
        timestamp: "2020-01-01T00:00:00Z",
      },
      {
        serialNumber: "123",
        batteryLevel: 0.7,
        timestamp: "2020-01-02T00:00:00Z",
      },
    ];
    const expected = {};
    expect(calculateBatteryUsage(batteryData)).toEqual(expected);
  });

  it("should handle irregular time intervals correctly", () => {
    const batteryData = [
      {
        serialNumber: "123",
        batteryLevel: 1.0,
        timestamp: "2020-01-01T12:00:00Z",
      },
      {
        serialNumber: "123",
        batteryLevel: 0.8,
        timestamp: "2020-01-03T12:00:00Z",
      },
    ];
    const expected = {};
    expect(calculateBatteryUsage(batteryData)).toEqual(expected);
  });
});

describe("aggregateBySchool", () => {
  it("should correctly aggregate device issues by school", () => {
    const batteryData = [
      { academyId: 1, serialNumber: "123" },
      { academyId: 1, serialNumber: "456" },
      { academyId: 2, serialNumber: "789" },
    ];
    const unhealthyDevices = { 123: 35, 789: 40 };

    const expected = {
      1: { goodCount: 1, badCount: 1, badDevices: ["123"] },
      2: { goodCount: 0, badCount: 1, badDevices: ["789"] },
    };

    expect(aggregateBySchool(batteryData, unhealthyDevices)).toEqual(expected);
  });

  it("should handle schools with no unhealthy devices", () => {
    const batteryData = [
      { academyId: 1, serialNumber: "123" },
      { academyId: 2, serialNumber: "456" },
    ];
    const unhealthyDevices = {};
    const expected = {
      1: { goodCount: 1, badCount: 0, badDevices: [] },
      2: { goodCount: 1, badCount: 0, badDevices: [] },
    };

    expect(aggregateBySchool(batteryData, unhealthyDevices)).toEqual(expected);
  });

  it("should handle missing or incomplete data entries", () => {
    const batteryData = [{ academyId: 1 }, { serialNumber: "456" }];
    const unhealthyDevices = { 456: 35 };
    const expected = {
      1: { goodCount: 1, badCount: 0, badDevices: [] },
      undefined: { goodCount: 0, badCount: 1, badDevices: ["456"] },
    };

    expect(aggregateBySchool(batteryData, unhealthyDevices)).toEqual(expected);
  });

  it("should handle cases where all devices are unhealthy", () => {
    const batteryData = [
      { academyId: 1, serialNumber: "123" },
      { academyId: 1, serialNumber: "456" },
    ];
    const unhealthyDevices = { 123: 35, 456: 40 };
    const expected = {
      1: { goodCount: 0, badCount: 2, badDevices: ["123", "456"] },
    };

    expect(aggregateBySchool(batteryData, unhealthyDevices)).toEqual(expected);
  });
});
