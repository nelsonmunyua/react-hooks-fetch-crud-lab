import React from "react";

function QuestionItem({ question, onDeleteQuestion, onUpdateQuestion }) {
  const { id, prompt, answers, correctIndex } = question;

  function handleDeleteClick() {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => onDeleteQuestion(id))
      .catch((err) => console.error("Delete failed:", err));
  }

  function handleCorrectAnswerChange(e) {
    const newCorrectIndex = parseInt(e.target.value, 10);

    // ✅ Instantly update UI (makes the test pass)
    onUpdateQuestion({ ...question, correctIndex: newCorrectIndex });

    // ✅ Update backend
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((r) => r.json())
      .then((updatedQuestion) => {
        onUpdateQuestion(updatedQuestion);
      })
      .catch((err) => console.error("Update failed:", err));
  }

  return (
    <li>
      <h4>{prompt}</h4>
      <label>
        Correct Answer:
        <select value={correctIndex} onChange={handleCorrectAnswerChange}>
          {answers.map((answer, index) => (
            <option key={index} value={index}>
              {answer}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleDeleteClick}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;