import { describe, expect, it } from "vitest";
import { criticAttacks } from "./criticAttacks";
import { grievingModes } from "./grievingModes";
import { fourFProfiles, recoverySigns } from "./learnContent";
import { methods } from "./methods";
import { rescueSteps } from "./rescueSteps";

describe("deterministic clinical content", () => {
  it("contains all 13 rescue steps", () => {
    expect(rescueSteps).toHaveLength(13);
    expect(rescueSteps.map((step) => step.number)).toEqual(
      Array.from({ length: 13 }, (_, index) => index + 1),
    );
  });

  it("contains all 14 critic attacks and corrections", () => {
    expect(criticAttacks).toHaveLength(14);
    expect(criticAttacks.map((attack) => attack.id)).toEqual(
      Array.from({ length: 14 }, (_, index) => index + 1),
    );
    expect(
      criticAttacks.every((attack) => attack.correction.trim().length > 20),
    ).toBe(true);
  });

  it("contains all four grieving modes with safety steps", () => {
    expect(grievingModes).toHaveLength(4);
    expect(
      grievingModes.every(
        (mode) =>
          mode.steps.length >= 6 &&
          mode.safetyNote.length > 20 &&
          mode.whenToUse.length > 0,
      ),
    ).toBe(true);
  });

  it("contains the non-diagnostic 4F and recovery content", () => {
    expect(fourFProfiles).toHaveLength(4);
    expect(recoverySigns).toHaveLength(9);
    expect(fourFProfiles.every((profile) => profile.direction.length > 20)).toBe(
      true,
    );
  });

  it("loads all 29 methods from the read-only method library", () => {
    expect(methods).toHaveLength(29);
  });
});
