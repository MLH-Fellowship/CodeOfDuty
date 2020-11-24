import React from "react";
import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App", () => {
  test("renders welcome message and log in button", async () => {
    render(<App />);
    expect(screen.getByText("Welcome, warrior!")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /login with github/i })
    ).toBeInTheDocument();
  });
  test("renders logo and home link", async () => {
    render(<App />);
    const logo = screen.getByRole("img", { name: "logo" });
    expect(logo).toBeInTheDocument();
    expect(logo.closest("a")).toHaveAttribute("href", "http://localhost:3000/");
  });
  test("renders top global sprints", async () => {
    render(<App />);
    expect(
      screen.getByText("🌎 Top Global Active Sprints 🌏")
    ).toBeInTheDocument();
  });
});
