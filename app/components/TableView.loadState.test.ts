import { loadState, COLUMNS_STORAGE_KEY } from "./TableView";

beforeEach(() => localStorage.clear());

describe("TableView loadState", () => {
  it("returns base prefs (all visible, defaults) and not customized when nothing is stored", () => {
    const { prefs, customized } = loadState();
    expect(prefs.name).toEqual({ visible: true, width: 280 });
    expect(prefs.state).toEqual({ visible: true, width: 160 });
    expect(prefs.domain).toEqual({ visible: true, width: 220 });
    expect(customized).toBe(false);
  });

  it("hydrates visibility from storage without marking customized", () => {
    localStorage.setItem(
      COLUMNS_STORAGE_KEY,
      JSON.stringify({ state: { visible: false } }),
    );
    const { prefs, customized } = loadState();
    expect(prefs.state.visible).toBe(false);
    expect(prefs.name.visible).toBe(true);
    expect(customized).toBe(false);
  });

  it("marks customized and clamps a stored width up to the column minimum", () => {
    localStorage.setItem(
      COLUMNS_STORAGE_KEY,
      JSON.stringify({ state: { visible: true, width: 10 } }),
    );
    const { prefs, customized } = loadState();
    expect(customized).toBe(true);
    expect(prefs.state.width).toBe(90); // state minWidth
  });

  it("keeps a stored width that is above the minimum", () => {
    localStorage.setItem(
      COLUMNS_STORAGE_KEY,
      JSON.stringify({ domain: { visible: true, width: 400 } }),
    );
    expect(loadState().prefs.domain.width).toBe(400);
  });

  it("rejects an all-hidden state and falls back to base", () => {
    localStorage.setItem(
      COLUMNS_STORAGE_KEY,
      JSON.stringify({
        name: { visible: false },
        state: { visible: false },
        domain: { visible: false },
      }),
    );
    const { prefs } = loadState();
    expect(prefs.name.visible).toBe(true);
    expect(prefs.state.visible).toBe(true);
    expect(prefs.domain.visible).toBe(true);
  });

  it("falls back to base on corrupt JSON", () => {
    localStorage.setItem(COLUMNS_STORAGE_KEY, "not json");
    const { prefs, customized } = loadState();
    expect(prefs.name.visible).toBe(true);
    expect(customized).toBe(false);
  });
});
