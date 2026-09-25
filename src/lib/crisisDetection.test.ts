import { describe, expect, it } from "vitest";
import { detectCrisis } from "./crisisDetection";

describe("detectCrisis", () => {
  it("detects the required acceptance phrase", () => {
    expect(detectCrisis("我不想活了").matched).toBe(true);
  });

  it("detects normalized self-harm wording", () => {
    expect(detectCrisis("我 想 伤 害 自 己。").matched).toBe(true);
    expect(detectCrisis("真的活不下去").categories).toContain("self_harm");
  });

  it("detects current danger wording", () => {
    const result = detectCrisis("我正在被虐待，需要立即逃离");

    expect(result.matched).toBe(true);
    expect(result.categories).toContain("current_danger");
  });

  it("does not match ordinary distress", () => {
    expect(detectCrisis("我今天很难过，也很累").matched).toBe(false);
  });

  it("does not match the lone character death", () => {
    expect(detectCrisis("这个词里有一个死字").matched).toBe(false);
  });
});
