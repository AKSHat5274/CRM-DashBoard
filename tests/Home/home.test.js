import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Home } from "./Home";
import { useCustom } from "@refinedev/core";

// Mocking useCustom hook
jest.mock("@refinedev/core", () => ({
  useCustom: jest.fn(() => ({ data: { data: { companies: { totalCount: 10 }, contacts: { totalCount: 20 }, deals: { totalCount: 30 } } }, isLoading: false })),
}));

describe("Home Component", () => {
  it("renders without crashing", () => {
    render(<Home />);
  });

  it("renders total count cards with correct data", async () => {
    const { getByText } = render(<Home />);
    await waitFor(() => {
      expect(getByText("Companies")).toBeInTheDocument();
      expect(getByText("10")).toBeInTheDocument();
      expect(getByText("Contacts")).toBeInTheDocument();
      expect(getByText("20")).toBeInTheDocument();
      expect(getByText("Deals")).toBeInTheDocument();
      expect(getByText("30")).toBeInTheDocument();
    });
  });

  it("renders upcoming events and deals charts", async () => {
    const { getByText } = render(<Home />);
    await waitFor(() => {
      expect(getByText("Upcoming Events")).toBeInTheDocument();
      expect(getByText("Deals")).toBeInTheDocument();
    });
  });

  it("renders dashboard latest activities", async () => {
    const { getByText } = render(<Home />);
    await waitFor(() => {
      expect(getByText("Dashboard Latest Activities")).toBeInTheDocument();
    });
  });

});
