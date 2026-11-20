// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Certificates, { formatCertificateTitle } from "./Certificates.jsx";

afterEach(() => {
  document.body.style.overflow = "";
});

describe("Certificates", () => {
  it("turns filenames into readable event titles", () => {
    expect(formatCertificateTitle("roboRush-2025.jpg")).toBe("Robo Rush 2025");
    expect(formatCertificateTitle("sih2026.jpeg")).toBe("SIH 2026");
    expect(formatCertificateTitle("coding_waters-2024.png")).toBe("Coding Waters 2024");
    expect(formatCertificateTitle("inamigos-ai-web-development-internship-2026.png")).toBe(
      "Inamigos AI Web Development Internship 2026",
    );
  });

  it("includes the Campus Ambassador achievement", () => {
    render(<Certificates />);

    expect(screen.getByText("Campus Ambassador — IIT Kharagpur")).toBeTruthy();
    expect(screen.getByText("2025")).toBeTruthy();
    expect(
      screen.getByText(/Served as a Campus Ambassador representing IIT Kharagpur/),
    ).toBeTruthy();
    expect(
      screen.getByText("Top 50 Team — Smart India Hackathon (SIH) Internal Round"),
    ).toBeTruthy();
    expect(screen.getByText("2026")).toBeTruthy();
    expect(screen.getByText(/Achieved a Top 50 team position in the internal selection round/)).toBeTruthy();
  });

  it("shows scanned files and supports preview, zoom, navigation and closing", () => {
    render(<Certificates />);

    const cards = screen.getAllByRole("button", { name: /^View .* certificate$/ });
    expect(cards).toHaveLength(6);
    expect(screen.getByRole("button", { name: "View SIH 2026 certificate" })).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "View Inamigos AI Web Development Internship 2026 certificate",
      }),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "View Aavahan 2025 certificate" }));
    expect(screen.getByRole("dialog", { name: "Aavahan 2025 certificate preview" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(screen.getByText("125%")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Next certificate" }));
    expect(screen.getByRole("dialog", { name: "Coding Waters 2024 certificate preview" })).toBeTruthy();
    expect(screen.getByText("100%")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes when the backdrop is clicked", () => {
    render(<Certificates />);
    fireEvent.click(screen.getByRole("button", { name: "View Aavahan 2025 certificate" }));

    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
