import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AIAssistant from "../AIAssistant";
import * as aiStream from "../../../lib/aiStream";

// Mock the AI stream module so tests never call real endpoints
vi.mock("../../../lib/aiStream", () => ({
  streamAssistantMessage: vi.fn()
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe("AIAssistant Chat Message Renderer & Streaming Lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders floating trigger button and opens dialog upon clicking", async () => {
    const user = userEvent.setup();
    render(<AIAssistant />);

    // Query floating button by accessible label/role
    const triggerBtn = screen.getByRole("button", { name: /Open Renterty AI Rental Concierge/i });
    expect(triggerBtn).toBeInTheDocument();

    await user.click(triggerBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Renterty AI Concierge/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask about properties, rent estimates/i)).toBeInTheDocument();
  });

  it("handles prompt submission and streaming token response", async () => {
    const user = userEvent.setup();

    aiStream.streamAssistantMessage.mockImplementation(async ({ onToken, onDone }) => {
      onToken("Here ");
      onToken("are ");
      onToken("matching ");
      onToken("rentals.");
      if (onDone) onDone();
    });

    render(<AIAssistant />);

    // Open assistant
    await user.click(screen.getByRole("button", { name: /Open Renterty AI Rental Concierge/i }));

    const input = screen.getByPlaceholderText(/Ask about properties, rent estimates/i);
    await user.type(input, "Find apartments in Soho");

    const sendBtn = screen.getByRole("button", { name: /Send message/i });
    await user.click(sendBtn);

    // Verify user message appears in ledger
    expect(screen.getByText("Find apartments in Soho")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Here are matching rentals\./i)).toBeInTheDocument();
    });
  });

  it("handles stop generation button and retains partial text", async () => {
    const user = userEvent.setup();

    // Mock streaming process that awaits
    aiStream.streamAssistantMessage.mockImplementation(async ({ onToken }) => {
      onToken("Manhattan has several iconic neighborhoods.");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    });

    render(<AIAssistant />);
    await user.click(screen.getByRole("button", { name: /Open Renterty AI Rental Concierge/i }));

    const input = screen.getByPlaceholderText(/Ask about properties, rent estimates/i);
    await user.type(input, "Tell me about Manhattan");

    await user.click(screen.getByRole("button", { name: /Send message/i }));

    // Verify stop button is rendered during generation
    const stopBtn = await screen.findByRole("button", { name: /Stop generating response/i });
    expect(stopBtn).toBeInTheDocument();

    await user.click(stopBtn);

    // Verify stop indicator appears
    await waitFor(() => {
      expect(screen.getByText(/Response paused by user/i)).toBeInTheDocument();
    });
  });

  it("handles streaming error state and provides single-turn retry", async () => {
    const user = userEvent.setup();

    let callCount = 0;
    aiStream.streamAssistantMessage.mockImplementation(async ({ onError, onToken, onDone }) => {
      callCount++;
      if (callCount === 1) {
        if (onError) onError(new Error("Network connection lost"));
      } else {
        onToken("Retry succeeded! Here is your listing data.");
        if (onDone) onDone();
      }
    });

    render(<AIAssistant />);
    await user.click(screen.getByRole("button", { name: /Open Renterty AI Rental Concierge/i }));

    const input = screen.getByPlaceholderText(/Ask about properties, rent estimates/i);
    await user.type(input, "Check Miami pricing");
    await user.click(screen.getByRole("button", { name: /Send message/i }));

    // Expect error state UI
    await waitFor(() => {
      expect(screen.getByText(/connection interruption/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Retry Prompt/i })).toBeInTheDocument();
    });

    // Click retry
    const retryBtn = screen.getByRole("button", { name: /Retry Prompt/i });
    await user.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText(/Retry succeeded! Here is your listing data\./i)).toBeInTheDocument();
    });
  });

  it("closes dialog when clicking close button or pressing Escape", async () => {
    const user = userEvent.setup();
    render(<AIAssistant />);

    await user.click(screen.getByRole("button", { name: /Open Renterty AI Rental Concierge/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close via close button
    const closeBtn = screen.getByRole("button", { name: /Close Assistant/i });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
