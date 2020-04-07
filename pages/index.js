import Link from 'next/link';
import Head from 'next/head';
import { CalendarAPI } from '../api';
import { useTodos } from '../hooks';

export default function Index() {
    const [todos, setTodos] = useTodos();

    const addTodo = () => {
      const todo = Math.round(100*Math.random()) + '';
      setTodos([...todos,todo]);
    }
    return (
      <div>
        <Link href="/about">
            <a>About Page {CalendarAPI.getBlah()}</a>
        <Head>
        <script async defer src="https://apis.google.com/js/api.js"></script>
        </Head>
        <Link href="/about">
            <a>About Page</a>
        </Link>
        <button onClick={addTodo}>Add todo</button>
        {todos.map(d=>(<div key={d}>{d}</div>))}
        <p>Hello Next.js</p>
        <CalendarAPI />
      </div>
    );
  }