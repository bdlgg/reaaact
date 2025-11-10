import './App.css'
import Greeting from "./Greeting.jsx";
import UserCard from "./UserCard.jsx";
import TaskList from "./TaskList.jsx";
import Counter from "./Counter.jsx";

function App() {
    return (
        <div className="App">
            <Greeting />
            <UserCard name="Антон" role="Администратор" avatarURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfVMhpKmVy_-iwfRLAiNiaDslMa-2oEz7KTw&s" isOnline={true}/>
            <UserCard name="Леха" role="Сомелье" avatarURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfVMhpKmVy_-iwfRLAiNiaDslMa-2oEz7KTw&s" isOnline={true}/>
            <UserCard name="Саня" role="Экономист" avatarURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfVMhpKmVy_-iwfRLAiNiaDslMa-2oEz7KTw&s" isOnline={false}/>
            <TaskList />
            <Counter />
        </div>
    );
}

export default App
