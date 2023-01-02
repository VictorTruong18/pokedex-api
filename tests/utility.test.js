import { parseStringToArray } from "../controllers/utility.js";

describe("parseStringToArray", () => {
  it("succesfully returns an array of integers parsed from the input string", () => {
    expect(parseStringToArray("1.2.3.4.5.6")).toEqual([1, 2, 3, 4, 5, 6]);
    expect(parseStringToArray("800.2100.3600")).toEqual([800, 2100, 3600]);
  });

  it("returns an empty array when empty string or no argument", () => {
    expect(parseStringToArray()).toEqual([]);
    expect(parseStringToArray("")).toEqual([]);
  });
});
