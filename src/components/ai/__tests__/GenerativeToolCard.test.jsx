import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GenerativeToolCard from "../GenerativeToolCard";

describe("GenerativeToolCard Component Lifecycle", () => {
  it("renders the calling/executing state with spinner and input parameters", () => {
    const toolState = {
      status: "executing",
      name: "searchProperties",
      input: { location: "Miami", maxRent: 4000 }
    };

    render(<GenerativeToolCard toolState={toolState} />);

    expect(screen.getByText(/Executing PropTech Tool: searchProperties/i)).toBeInTheDocument();
    expect(screen.getByText("Miami")).toBeInTheDocument();
    expect(screen.getByText("4000")).toBeInTheDocument();
  });

  it("renders property search results with price badges and action links", () => {
    const toolState = {
      status: "success",
      name: "searchProperties",
      result: {
        filterSummary: "Miami • Under $4,500/mo",
        items: [
          {
            _id: "prop-101",
            title: "Sunny South Beach Oceanfront Condo",
            location: "Miami, FL",
            rent: 3200,
            rentType: "Monthly",
            propertyType: "Apartment",
            bedrooms: 2,
            bathrooms: 2,
            images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"]
          }
        ]
      }
    };

    render(<GenerativeToolCard toolState={toolState} />);

    expect(screen.getByText(/Verified Matching Rentals/i)).toBeInTheDocument();
    expect(screen.getByText("Sunny South Beach Oceanfront Condo")).toBeInTheDocument();
    expect(screen.getByText("Miami, FL")).toBeInTheDocument();
    expect(screen.getByText(/3,200/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View/i })).toHaveAttribute("href", "/properties/prop-101");
  });

  it("renders the AI rent estimator generative UI with valuation breakdown", () => {
    const toolState = {
      status: "success",
      name: "estimateRent",
      result: {
        location: "Austin, TX",
        specs: "3 Bed • 2 Bath",
        estimatedRent: 2850,
        lowRange: 2600,
        highRange: 3100,
        confidence: 94
      }
    };

    render(<GenerativeToolCard toolState={toolState} />);

    expect(screen.getByText("AI Rent Valuation")).toBeInTheDocument();
    expect(screen.getByText(/Austin, TX • 3 Bed • 2 Bath/i)).toBeInTheDocument();
    expect(screen.getByText("$2,850")).toBeInTheDocument();
    expect(screen.getByText(/94% Confidence/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Browse Comp Listings/i })).toHaveAttribute("href", "/properties");
    expect(screen.getByRole("link", { name: /List at this Rate/i })).toHaveAttribute("href", "/landlords");
  });

  it("renders the interactive tour proposal card with action link", () => {
    const toolState = {
      status: "success",
      name: "scheduleTour",
      result: {
        propertyTitle: "The Grand Manhattan Penthouse",
        preferredDate: "Tomorrow at 2:00 PM",
        tourType: "Live Virtual Walkthrough",
        actionUrl: "/properties/prop-99"
      }
    };

    render(<GenerativeToolCard toolState={toolState} />);

    expect(screen.getByText("Tour Proposal Ready")).toBeInTheDocument();
    expect(screen.getByText("The Grand Manhattan Penthouse")).toBeInTheDocument();
    expect(screen.getByText(/Tomorrow at 2:00 PM \(Live Virtual Walkthrough\)/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Confirm & Select Tour Time/i })).toHaveAttribute("href", "/properties/prop-99");
  });

  it("renders the maintenance triage card with safety level and response SLA", () => {
    const toolState = {
      status: "success",
      name: "triageMaintenance",
      result: {
        urgency: "High / Urgent Repair",
        sla: "2 Hours",
        safetyTip: "Turn off main water isolation valve under the sink immediately."
      }
    };

    render(<GenerativeToolCard toolState={toolState} />);

    expect(screen.getByText(/AI Triage: High \/ Urgent Repair/i)).toBeInTheDocument();
    expect(screen.getByText(/Response ETA: 2 Hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Turn off main water isolation valve/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Track in Maintenance Hub/i })).toHaveAttribute("href", "/dashboard?tab=maintenance");
  });

  it("renders a user-friendly error card when tool execution fails", () => {
    const toolState = {
      status: "error",
      name: "searchProperties",
      error: "No properties available in chosen radius"
    };

    render(<GenerativeToolCard toolState={toolState} />);

    expect(
      screen.getByText(/Failed to execute searchProperties: No properties available in chosen radius/i)
    ).toBeInTheDocument();
  });
});
