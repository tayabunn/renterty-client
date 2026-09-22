import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardAiChat from "../DashboardAiChat";
import * as aiModule from "../../../lib/ai";

// Mock toast
vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    custom: vi.fn()
  }
}));

// Mock aiAssistantMessage
vi.mock("../../../lib/ai", () => ({
  aiAssistantMessage: vi.fn()
}));

describe("DashboardAiChat Component Lifecycle & Multi-Session State", () => {
  const mockTenant = {
    id: "tenant-101",
    name: "John Tenant",
    role: "Tenant",
    email: "john@test.com"
  };

  const mockOwner = {
    id: "owner-202",
    name: "Jane Landlord",
    role: "Owner",
    email: "jane@test.com"
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders welcoming screen with role-tailored starter prompts for Tenant", () => {
    render(<DashboardAiChat user={mockTenant} />);

    expect(screen.getByText(/How can I help you today, John?/i)).toBeInTheDocument();
    expect(screen.getByText(/Find 2-Bed Apartments/i)).toBeInTheDocument();
    expect(screen.getByText(/Lease & Deposit Rights/i)).toBeInTheDocument();
    expect(screen.getAllByText(/New Chat/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders role-tailored prompts for Owner", () => {
    render(<DashboardAiChat user={mockOwner} />);

    expect(screen.getByText(/How can I help you today, Jane?/i)).toBeInTheDocument();
    expect(screen.getByText(/Rental Yield & Price Estimator/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Converting Listing Copy/i)).toBeInTheDocument();
  });

  it("handles prompt submission and displays user and AI assistant responses", async () => {
    aiModule.aiAssistantMessage.mockResolvedValueOnce({
      success: true,
      reply: "Here are the top 2-bedroom listings in your budget.",
      properties: [
        { _id: "p1", title: "Sunset Heights 2B", location: "Midtown", rent: 2200, rentType: "mo" }
      ]
    });

    render(<DashboardAiChat user={mockTenant} />);

    const input = screen.getByPlaceholderText(/Ask Tenant AI assistant/i);
    fireEvent.change(input, { target: { value: "Show me available 2-bed units" } });

    const sendBtn = screen.getByTitle("Send message");
    fireEvent.click(sendBtn);

    // User message should appear immediately
    expect(screen.getAllByText("Show me available 2-bed units").length).toBeGreaterThanOrEqual(1);

    // AI response should appear after resolution
    await waitFor(() => {
      expect(screen.getByText("Here are the top 2-bedroom listings in your budget.")).toBeInTheDocument();
      expect(screen.getByText("Sunset Heights 2B")).toBeInTheDocument();
    });
  });

  it("creates a new session when clicking + New Chat", async () => {
    render(<DashboardAiChat user={mockTenant} />);

    const newChatBtns = screen.getAllByRole("button", { name: /New Chat/i });
    fireEvent.click(newChatBtns[0]);

    expect(screen.getByText(/How can I help you today, John?/i)).toBeInTheDocument();
  });
});
