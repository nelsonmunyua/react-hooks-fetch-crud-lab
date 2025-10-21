import React, { useEffect, useState } from "react";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";

function App() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState("list");

  // ✅ Fetch questions once when the component mounts
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch("http://localhost:4000/questions", { signal })
      .then((r) => r.json())
      .then((data) => setQuestions(data))
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    // ✅ cleanup to prevent memory leak
    return () => controller.abort();
  }, []);

  // ✅ Add new question
  function handleAddQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
    setPage("list"); // Return to list after adding
  }

  // ✅ Delete a question
  function handleDeleteQuestion(id) {
    setQuestions(questions.filter((q) => q.id !== id));
  }

  // ✅ Update question (after PATCH)
  function handleUpdateQuestion(updatedQuestion) {
    const updatedList = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuestions(updatedList);
  }

  return (
    <main>
      <h1>Quiz Admin</h1>
      <section>
        <button onClick={() => setPage("list")}>View Questions</button>
        <button onClick={() => setPage("form")}>New Question</button>
      </section>

      {page === "list" ? (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      ) : (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      )}
    </main>
  );
}

export default App;