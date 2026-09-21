import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MaintenanceRequestModal from "../MaintenanceRequestModal";
import * as services from "../../../lib/services";

// Mock the services module so tests never call real APIs
vi.mock("../../../lib/services", () => ({
  triageMaintenancePreview: vi.fn(),
  createMaintenanceTicket: vi.fn()
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe("MaintenanceRequestModal Form Validation & AI Diagnostics", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    property: {
      _id: "prop-sample-01",
      title: "The Grand Manhattan Penthouse"
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal dialog with accessible form controls", () => {
    render(<MaintenanceRequestModal {...defaultProps} />);

    // Querying strictly by semantic role and label text
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Report Maintenance Issue/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\., Water leaking under kitchen sink pipe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe what happened, when it started/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Dispatch Ticket/i })).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(<MaintenanceRequestModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("populates fields when a preset sample button is clicked", async () => {
    const user = userEvent.setup();
    render(<MaintenanceRequestModal {...defaultProps} />);

    const sampleButton = screen.getByRole("button", { name: /💧 Kitchen Leak/i });
    await user.click(sampleButton);

    const titleInput = screen.getByPlaceholderText(/e\.g\., Water leaking under kitchen sink pipe/i);
    expect(titleInput).toHaveValue("Water leaking from kitchen sink pipe");
  });

  it("triggers AI diagnostics preview and populates suggested urgency and tips", async () => {
    const user = userEvent.setup();
    services.triageMaintenancePreview.mockResolvedValueOnce({
      triaging: {
        suggestedUrgency: "High",
        suggestedCategory: "Plumbing",
        estimatedCostRange: "$150 - $350",
        isSafetyRisk: true,
        summary: "Active pipe failure detected under sink.",
        troubleshootingTip: "Shut off water valve beneath the basin."
      }
    });

    render(<MaintenanceRequestModal {...defaultProps} />);

    // Fill title & description
    await user.type(
      screen.getByPlaceholderText(/e\.g\., Water leaking under kitchen sink pipe/i),
      "Burst pipe"
    );
    await user.type(
      screen.getByPlaceholderText(/Describe what happened, when it started/i),
      "Water is spraying heavily."
    );

    // Click AI Diagnostics button
    const aiDiagButton = screen.getByRole("button", { name: /Run AI Diagnostics/i });
    await user.click(aiDiagButton);

    await waitFor(() => {
      expect(services.triageMaintenancePreview).toHaveBeenCalledWith({
        title: "Burst pipe",
        description: "Water is spraying heavily.",
        category: "Plumbing"
      });
      expect(screen.getByText(/AI Triage & Safety Diagnostic/i)).toBeInTheDocument();
      expect(screen.getByText(/Est\. Cost: \$150 - \$350/i)).toBeInTheDocument();
      expect(screen.getByText(/Shut off water valve beneath the basin\./i)).toBeInTheDocument();
    });
  });

  it("submits the validated form and calls callbacks upon successful dispatch", async () => {
    const user = userEvent.setup();
    services.createMaintenanceTicket.mockResolvedValueOnce({ success: true });

    render(<MaintenanceRequestModal {...defaultProps} />);

    await user.type(
      screen.getByPlaceholderText(/e\.g\., Water leaking under kitchen sink pipe/i),
      "Heater failure"
    );
    await user.type(
      screen.getByPlaceholderText(/Describe what happened, when it started/i),
      "No heating in living room overnight."
    );

    const submitBtn = screen.getByRole("button", { name: /Dispatch Ticket/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(services.createMaintenanceTicket).toHaveBeenCalledWith({
        propertyId: "prop-sample-01",
        category: "Plumbing",
        title: "Heater failure",
        description: "No heating in living room overnight.",
        urgency: "Medium"
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
