import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import PropTypes from 'prop-types';

import Users from './pages/Users';
import Products from './pages/Products';

const initialState = { name: '', description: '' };
const client = generateClient();

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({
        query: listTodos,
      });
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log('error fetching todos');
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await client.graphql({
        query: createTodo,
        variables: {
          input: todo,
        },
      });
    } catch (err) {
      console.log('error creating todo:', err);
    }
  }

  return (
    <Router>
      <div style={styles.container}>
        <Heading level={1}>Hello {user.username}</Heading>
        <Button onClick={signOut}>Sign out</Button>
        <h2>Amplify Todos</h2>
        <nav>
          <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
            <li style={{ marginRight: '15px' }}>
              <Link to="/">Home</Link>
            </li>
            <li style={{ marginRight: '15px' }}>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/" element={
            <div>
              <input
                onChange={(event) => setInput('name', event.target.value)}
                style={styles.input}
                value={formState.name}
                placeholder="Name"
              />
              <input
                onChange={(event) => setInput('description', event.target.value)}
                style={styles.input}
                value={formState.description}
                placeholder="Description"
              />
              <button style={styles.button} onClick={addTodo}>
                Create Todo
              </button>
              {todos.map((todo, index) => (
                <div key={todo.id ? todo.id : index} style={styles.todo}>
                  <p style={styles.todoName}>{todo.name}</p>
                  <p style={styles.todoDescription}>{todo.description}</p>
                </div>
              ))}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

App.propTypes = {
  signOut: PropTypes.func,
  user: PropTypes.object,
};

const styles = {
  container: {
    width: 400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: 'none',
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: 'black',
    color: 'white',
    outline: 'none',
    fontSize: 18,
    padding: '12px 0px',
  },
};

export default withAuthenticator(App);
