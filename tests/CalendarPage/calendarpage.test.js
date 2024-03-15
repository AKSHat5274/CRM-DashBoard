import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { CalenderPage } from "./CalenderPage";
import { useList } from "@refinedev/core";
import {
  CALENDAR_UPCOMING_EVENTS_QUERY,
} from "@/graphql/queries";

jest.mock("@refinedev/core", () => ({
  useList: jest.fn(() => ({ data: [], isLoading: false })),
}));

describe("CalenderPage Component", () => {
  beforeEach(() => {
    // Mock window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800, // Simulate a medium screen size
    });
  });

  it("renders without crashing", () => {
    render(<CalenderPage />);
  });

  it("fetches upcoming events data", async () => {
    render(<CalenderPage />);
    await waitFor(() => {
      expect(useList).toHaveBeenCalledWith({
        resource: "events",
        pagination: { mode: "off" },
        sorters: [{ field: "startDate", order: "asc" }],
        filters: [
          {
            field: "startDate",
            operator: "gte",
            value: expect.any(String), // Ensure it's a valid date string
          },
        ],
        meta: { gqlQuery: CALENDAR_UPCOMING_EVENTS_QUERY },
      });
    });
  });


  it("renders correctly on small screen size", async () => {
    // Set window.innerWidth to simulate small screen size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400, // Simulate a small screen size
    });

    const { getByText } = render(<CalenderPage />);
    await waitFor(() => {
      expect(getByText("Description")).toBeInTheDocument();
      expect(getByText("Dates")).toBeInTheDocument();
      expect(getByText("Users")).toBeInTheDocument();
    });
  });
//This test is needed because we are formatting the data that we took from the database and the we are formatting the data so it can be rendered by full calendar
  it("formats eventsFinal correctly for rendering", async () => {
    const mockEvents = [
      {
        id: "1",
        title: "Event 1",
        startDate: "2024-03-15T09:00:00",
        endDate: "2024-03-15T11:00:00",
        color: "green",
        description: "Event 1 Description",
        participants: [],
      },
    ];

    jest.spyOn(require("@refinedev/core"), "useList").mockImplementation((resource) => {
      if (resource.resource === "events") {
        return { data: { data: mockEvents }, isLoading: false };
      } else {
        return { data: [], isLoading: false };
      }
    });
//This will check wether we are rendering all the accordian components in the drawer properly or not.
    const { container, getByText } = render(<CalenderPage />);
    await waitFor(() => {
      fireEvent.click(container.querySelector(".fc-event")); // Simulate click on an event element
    });

    // Assert that the elements are rendered in the drawer
    await waitFor(() => {
      expect(getByText("Description")).toBeInTheDocument();
      expect(getByText("Dates")).toBeInTheDocument();
      expect(getByText("Users")).toBeInTheDocument();
    });
  });

});
