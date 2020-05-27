import { useState } from 'react';

function useTodos() {
  const [todos, setTodos] = useState([]);

  return [todos, setTodos];
}

export { useTodos };
