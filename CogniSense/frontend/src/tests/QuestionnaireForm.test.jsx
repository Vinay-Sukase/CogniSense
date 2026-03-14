import { fireEvent, render, screen, vi } from "@testing-library/react";
import QuestionnaireForm from "../components/QuestionnaireForm";

describe("QuestionnaireForm", () => {
  it("updates the selected answer", () => {
    const answers = Array(12).fill(3);
    const setAnswers = vi.fn();

    render(<QuestionnaireForm answers={answers} setAnswers={setAnswers} />);

    fireEvent.click(screen.getAllByRole("button", { name: "5" })[0]);
    expect(setAnswers).toHaveBeenCalled();
  });
});
