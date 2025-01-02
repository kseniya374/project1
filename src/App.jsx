import React from "react";
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    function getRandomDate() {
      const start = new Date(2024, 8, 3); 
      const end = new Date(); 
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return randomDate.toLocaleString();
    }

    this.state = {
      value: "",
      description: "",
      filterPriority:{
        срочно: false,
        средне: false,
        'не срочно': false,
      },
      searchQuery: "",
      todos: [
        {
          name: "Погулять с собакой",
          description: "Во время прогулки с собакой нужно обязательно купить кофе и насладиться прекрасной погодой",
          priority: "средне",
          checked: false,
          createdAt: getRandomDate(),
        },
        {
          name: "Сделать домашнее задание",
          priority: "срочно",
          checked: false,
          createdAt: getRandomDate(),
        },
        {
          name: "Приготовить завтрак",
          priority: "не срочно",
          checked: false,
          createdAt: getRandomDate(),
        },
        {
          name: "Приготовить ужин",
          priority: "средне",
          checked: false,
          createdAt: getRandomDate(),
        },
        {
          name: "Позвонить родителям",
          priority: "средне",
          checked: true,
          createdAt: getRandomDate(),
        },
        {
          name: "Убрать квартиру",
          priority: "срочно",
          checked: true,
          createdAt: getRandomDate(),
        },
      ],
      hoveredTodoIndex: null,
      hideChecked: false,
      priority: "средне",
      scrollPosition: 0,
    };
  }

  handleGenerateTasks = () => {
    const generateRandomTasks = (num) => {
        const tasks = [];
        const priorities = ['срочно', 'средне', 'не срочно'];
        const taskNames = [
            "Погулять с собакой", 
            "Сделать домашнее задание", 
            "Приготовить завтрак", 
            "Приготовить ужин", 
            "Позвонить родителям", 
            "Убрать квартиру", 
            "Заняться спортом", 
            "Прочитать книгу", 
            "Написать отчет", 
            "Сделать стрижку"
        ];

        const taskDescriptions = [
            "Завершить задачи вовремя", 
            "Не забыть про важное", 
            "Обязательно покормить кота", 
            "Сделать паузу и отдохнуть", 
            "Обсудить финансы с родными", 
            "Поставить цели на следующую неделю", 
            "Собраться с друзьями", 
            "Спланировать свой день", 
            "Сравнить цены на товары", 
            "Подготовить документы к собеседованию"
        ];

        for (let i = 0; i < num; i++) {
            const randomName = taskNames[Math.floor(Math.random() * taskNames.length)];
            const randomDescription = taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)];
            const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
            const randomDate = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleString(); // замените на логику для генерации срока

            tasks.push({
                name: randomName,
                description: randomDescription,
                priority: randomPriority,
                checked: false,
                createdAt: randomDate,
            });
        }
        return tasks;
    };
  
    this.setState({ todos: generateRandomTasks(1000) });
  };
 
  handleInputChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };
  handlePriorityChange = (e) => {
    this.setState({
      priority: e.target.value,
    });
  };
  handleTodoAdd = () => {
    if (this.state.value.trim() === "" || this.state.description.trim() === "") return; 
    const newTodo = {
      name: this.state.value,
      description: this.state.description,
      priority: this.state.priority || "средне",
      checked: false,
      createdAt: new Date().toLocaleString(),
    };
    this.setState({
      todos: [newTodo,
        ...this.state.todos
      ],
      value: "",
      description: "",
      priority: "средне",
    });
  };

  handleTodoChecked = (index) => (e) => {
    const newTodo = { ...this.state.todos[index], checked: e.target.checked };
    const newTodos = this.state.todos
      .map((todo, i) => (i === index ? newTodo : todo))
      .sort((a, b) => a.checked - b.checked);
    this.setState({
      todos: newTodos,
    });
  };
  handleTodoDelete = (index) => () => {
    const newTodos = this.state.todos.filter((_, i) => i !== index);
    this.setState({
      todos: newTodos,
    });
  };
  handleAdditionalInputChange = (e) => {
    this.setState({
      description: e.target.value,
    }); 
  };
  handleMouseEnter = (index) => () => {
    this.setState({ hoveredTodoIndex: index });
  };

  handleMouseLeave = () => {
    this.setState({ hoveredTodoIndex: null });
  };
  handleHideCheckedChange = () => {
    this.setState((prevState) => ({ hideChecked: !prevState.hideChecked }));
  }
  handleSearchChange = (e) => {
    this.setState({
      searchQuery: e.target.value,
    });
  };
  handleFilterPriorityChange = (e) => {
     const { name, checked } = e.target;
      this.setState((prevState) => ({
         filterPriority: { ...prevState.filterPriority,
           [name]: checked } 
          }));
         };
  handlePriorityChange = (priority) => {
          this.setState({ 
              priority 
          });
      };
  render() {
    const isFilterPriorityIncluded = (todo) => {
      const { filterPriority } = this.state;
      return (
        filterPriority[todo.priority] || 
        Object.values(filterPriority).every((val) => !val) 
      );
    };
    
    const filteredTodos = this.state.todos.filter(todo => (!this.state.hideChecked || !todo.checked) &&
    (todo.name.toLowerCase().includes(this.state.searchQuery.toLowerCase()) || 
     (todo.description && todo.description.toLowerCase().includes(this.state.searchQuery.toLowerCase())))&&
     isFilterPriorityIncluded(todo)
  );
    return (
      <div class="app-container">
        <div class="header">
        <h1>Todo List</h1> 
          <div className="search-container">
            <input 
             type="text" 
             value={this.state.searchQuery} 
             onChange={this.handleSearchChange} 
             placeholder="Поиск задач" 
            />
          </div>
        </div>
        <div class="container_body">
        <div class="filters">
        <div className="container_filter">
          <label>
            <input 
              type="checkbox" 
              checked={this.state.hideChecked}
              onChange={this.handleHideCheckedChange}
              style={{marginRight: '10px'}}
            />
            Скрыть выполненные
          </label>
          </div> 
          <div className="container_filter2">
          <label>
              Важность:
              <input
              type="checkbox"
               name="срочно"
              cheсked={this.state.filterPriority['срочно']} 
              onChange={this.handleFilterPriorityChange}/>
              срочно
              <input
              type="checkbox"
              name="средне"
              cheсked={this.state.filterPriority['средне']} 
              onChange={this.handleFilterPriorityChange}/>
              средне
              <input
              type="checkbox"
              name="не срочно"
              cheсked={this.state.filterPriority['не срочно']} 
              onChange={this.handleFilterPriorityChange}/>
              не срочно
            </label>
          </div>
          </div>
      <div class="todo-list"
        style={{
          background: "white",
          height: 300,
          overflowY:"auto",
          width:"600px",
        }}
      >
        <ul>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, index) => (
              <Todo
                key={index}
                todo={todo}
                onTodoChecked={this.handleTodoChecked(index)}
                onMouseEnter={this.handleMouseEnter(index)}
                onMouseLeave={this.handleMouseLeave}
                isHovered={this.state.hoveredTodoIndex === index}
                onDelete={this.handleTodoDelete(index)}
              />
            ))
          ) : (
            <li className="no-results">По вашим критериям ничего не найдено</li>
          )}
        </ul>
      </div>
      </div>
      <h2>ДОБАВИТЬ ЗАДАЧУ</h2>
        <div className="container">
          <input 
           style={{marginTop:'100px'}}
            value={this.state.value} 
            onChange={this.handleInputChange} 
            placeholder="Введите название задачи" 
          />
          <input
            style={{ height: '70px' }} 
            value={this.state.description} 
            onChange={this.handleAdditionalInputChange} 
            placeholder="Введите описание задачи" 
          />
          <div class="priority">
           <label style={{marginRight:"5px",
            backgroundColor: "lightgray",padding: "10px",
             borderRadius: "5px", display: "inline-block"
           }}>
              Важность
              </label>
              <button 
                        onClick={() => this.handlePriorityChange("срочно")}
                        style={{ backgroundColor: this.state.priority === "срочно" ? "#ccc" : "#fff" }}
                    >
                      Срочно
                    </button>
                    <button 
                        onClick={() => this.handlePriorityChange("средне")}
                        style={{ backgroundColor: this.state.priority === "средне" ? "#ccc" : "#fff" }}
                    >
                      Средне
                    </button>
                    <button 
                        onClick={() => this.handlePriorityChange("не срочно")}
                        style={{ backgroundColor: this.state.priority === "не срочно" ? "#ccc" : "#fff" }}
                    >
                      Не срочно
                    </button>
                    </div>
            <button style={{marginTop:'10px', marginLeft:"710px"}} onClick={this.handleTodoAdd}>ДОБАВИТЬ</button>
            <button style={{marginTop:'10px', marginLeft:"710px"}} onClick={this.handleGenerateTasks}>Сгенерировать 1000 задач</button>
          </div>
      </div>
    );
  }
}
class Todo extends React.Component {
  render() {
    const { todo, onTodoChecked,onMouseEnter, onMouseLeave, isHovered, onDelete  } = this.props;
    return (
      <li
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`todo-item ${todo.checked ? 'completed' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        border: '1px solid black',
        marginBottom: '15px',
        backgroundColor: 'white',
        marginLeft: '-40px',
      }}
      >
         <div style={{ display:'flex',alignItems: 'center', }}>
        <input 
          type="checkbox" 
          checked={todo.checked} 
          onChange={onTodoChecked} 
        />
        <div style={{display:'flex',flexDirection: 'column',alignItems:'flex-start'}}>
        <span style={{ marginLeft: '10px', color: todo.checked ? "grey" : "black" }}>
          {todo.name}
        </span>
        <div style={{color: 'grey',fontSize: '12px'}}>
        {todo.description}
        </div>
        <span style={{ color: 'gery', fontSize: '12px' }}>
             {todo.priority}
            </span>
        </div>
        </div>
        <div style={{ color: 'grey', fontSize: '0.8em' }}>
            {todo.createdAt}
        </div> 
        {isHovered && (
          <button onClick={onDelete} style={{ marginLeft: '10px',backgroundColor:'#CC0000',color:'white' }}>
            Удалить
          </button>
        )}
      </li>
    );
  }
};
export default App;