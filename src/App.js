import './App.scss';

import { List } from '@material-ui/core';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

import { axios } from './api';
import GlobalDrawer from './components/GlobalDrawer/GlobalDrawer';
import GlobalToolbar from './components/GlobalToolbar/GlobalToolbar';
import TodoInput from './components/TodoInput/TodoInput';
import TodoItem from './components/TodoItem/TodoItem';

class App extends Component {
  state = {
    drawerOpened: false,
    inputText: '',
    todos: []
  };

  async componentDidMount() {
    const res = await axios({
      url: 'todos'
    });
    const todos = res.data;

    this.setState({
      todos
    });
  }

  render() {
    const { drawerOpened, inputText, todos } = this.state;

    return (
      <div className="App">
        <GlobalToolbar onClickToggler={this.onToggleDrawer} />
        <GlobalDrawer opened={drawerOpened} onToggle={this.onToggleDrawer} />
        <List>
          <TodoInput
            value={inputText}
            onChange={this.onChangeInputText}
            onSubmit={this.onCreateTodo}
          />
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              text={todo.body}
              completed={todo.completed}
              onToggleComplete={() => this.onToggleComplete(todo.id)}
              onClickRemove={() => this.onDeleteTodo(todo.id)}
            />
          ))}
        </List>
      </div>
    );
  }

  onToggleComplete = async todoId => {
    const { todos } = this.state;

    const todo = this._findTodoById(todoId);
    if (!todo) {
      return;
    }

    const res = await axios.put(`/todos/${todo.id}`, {
      completed: !todo.completed
    });
    const newTodo = res.data;

    this.setState({
      todos: todos.map(todo => {
        return todo.id === todoId ? newTodo : todo;
      })
    });
  };

  onAddTodo = todo => {
    const { todos } = this.state;

    this.setState({
      todos: [...todos, todo]
    });
  };

  onCreateTodo = async () => {
    const { inputText } = this.state;

    if (!inputText) {
      return;
    }

    const res = await axios.post('/todos', {
      body: inputText
    });
    const todo = res.data;

    this.setState({
      inputText: ''
    });

    this.onAddTodo(todo);
  };

  onRemoveTodo = todoId => {
    const { todos } = this.state;

    this.setState({
      todos: todos.filter(todo => todo.id !== todoId)
    });
  };

  onDeleteTodo = async todoId => {
    const todo = this._findTodoById(todoId);
    if (!todo) {
      return;
    }

    const res = await axios.delete(`/todos/${todo.id}`);
    const newTodo = res.data;
    this.onRemoveTodo(newTodo.id);
  };

  onChangeInputText = e => {
    this.setState({
      inputText: e.target.value
    });
  };

  onToggleDrawer = () => {
    const { drawerOpened } = this.state;

    this.setState({
      drawerOpened: !drawerOpened
    });
  };

  _findTodoById = todoId => {
    const { todos } = this.state;
    return todos.filter(todo => {
      return todo.id === todoId;
    })[0];
  };
}

export default hot(module)(App);
