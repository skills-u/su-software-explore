import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableView, { COLUMNS_STORAGE_KEY } from "./TableView";
import type { University } from "@/app/lib/types";

const ROWS: University[] = [
  {
    name: "Alpha University",
    domain: "alpha.edu",
    url: "https://alpha.edu",
    state: "Texas",
  },
  {
    name: "Bravo College",
    domain: "bravo.edu",
    url: "https://bravo.edu",
    state: null,
  },
];

function setup() {
  const onOpen = jest.fn();
  const onToggleFavorite = jest.fn();
  render(
    <TableView
      rows={ROWS}
      isFavorite={() => false}
      onOpen={onOpen}
      onToggleFavorite={onToggleFavorite}
    />,
  );
  return { onOpen, onToggleFavorite };
}

beforeEach(() => localStorage.clear());

describe("TableView", () => {
  it("renders column headers and row data", () => {
    setup();
    expect(
      screen.getByRole("columnheader", { name: /name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /state/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /domain/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /actions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Alpha University")).toBeInTheDocument();
    expect(screen.getByText("alpha.edu")).toBeInTheDocument();
    expect(screen.getByText("Texas")).toBeInTheDocument();
  });

  it("hides a column via the selector and persists it", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: /columns/i }));
    await user.click(screen.getByRole("checkbox", { name: /state/i }));
    expect(
      screen.queryByRole("columnheader", { name: /state/i }),
    ).not.toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem(COLUMNS_STORAGE_KEY)!);
    expect(stored.state.visible).toBe(false);
  });

  it("hydrates hidden columns from storage", () => {
    localStorage.setItem(
      COLUMNS_STORAGE_KEY,
      JSON.stringify({ domain: { visible: false } }),
    );
    setup();
    expect(
      screen.queryByRole("columnheader", { name: /domain/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /name/i }),
    ).toBeInTheDocument();
  });

  it("disables unchecking the last visible column", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      COLUMNS_STORAGE_KEY,
      JSON.stringify({
        state: { visible: false },
        domain: { visible: false },
      }),
    );
    setup();
    await user.click(screen.getByRole("button", { name: /columns/i }));
    const nameToggle = screen.getByRole("checkbox", { name: /name/i });
    expect(nameToggle).toBeChecked();
    expect(nameToggle).toBeDisabled();
  });

  it("calls onOpen when the Show action is clicked", async () => {
    const user = userEvent.setup();
    const { onOpen } = setup();
    await user.click(
      screen.getByRole("button", {
        name: /view details for Alpha University/i,
      }),
    );
    expect(onOpen).toHaveBeenCalledWith(ROWS[0]);
  });

  it("calls onToggleFavorite when the star is clicked", async () => {
    const user = userEvent.setup();
    const { onToggleFavorite } = setup();
    await user.click(
      screen.getByRole("button", {
        name: /add Alpha University to favorites/i,
      }),
    );
    expect(onToggleFavorite).toHaveBeenCalledWith("alpha.edu");
  });

  it("persists a resized column width on pointer-up", () => {
    setup();
    const handle = screen.getByRole("separator", {
      name: /resize state column/i,
    });
    // jsdom's PointerEvent doesn't carry clientX reliably; MouseEvents typed as
    // pointer events do, and the handlers only read clientX.
    fireEvent(
      handle,
      new MouseEvent("pointerdown", {
        clientX: 300,
        bubbles: true,
        cancelable: true,
      }),
    );
    fireEvent(
      document,
      new MouseEvent("pointermove", { clientX: 360, bubbles: true }), // +60
    );
    fireEvent(
      document,
      new MouseEvent("pointerup", { clientX: 360, bubbles: true }),
    );
    const stored = JSON.parse(localStorage.getItem(COLUMNS_STORAGE_KEY)!);
    expect(stored.state.width).toBe(220); // 160 default + 60
  });
});
