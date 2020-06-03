import { Button } from '@blueprintjs/core';
import { useTodos, useSession } from '../hooks';
import { Container, Element, Calendar, PocketModule } from '../modules';

const style = {
  gridColumnStart: 'middle-start',
  gridColumnEnd: 'middle-end',
  // gridRowStart: 'row1-start',
  // gridRowEnd: 'row1-end',
};

export default function Index() {
  const [todos, setTodos] = useTodos();

  const addTodo = () => {
    const todo = `${Math.round(100 * Math.random())}`;
    setTodos([...todos, todo]);
  };

  return (
    <Container>
      <Element style={style}>
        <Button onClick={addTodo}>Add todo</Button>
        {todos.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </Element>
      <Element style={style}>
        <Calendar />
      </Element>
      <Element style={style}>
        <PocketModule />
      </Element>
    </Container>
  );
}
