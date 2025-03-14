import { useState } from 'react';
import './TaskTracker.css';
import Sidebar from './Sidebar';
function TaskTracker() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');

    const addTask = () => {
        if (task) {
            setTasks([...tasks, { text: task, completed: false }]);
            setTask('');
        }
    };

    const toggleComplete = (index) => {
        const updatedTasks = tasks.map((t, i) =>
            i === index ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
    };

    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <>
        <Sidebar/>
        <div className='trackerContainer'style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Task Tracker</h1>
            <div>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter a task"
            />
            </div>


            <div>
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map((t, index) => (
                    <li key={index}>
                        <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
                            {t.text}
                        </span>
                        <button onClick={() => toggleComplete(index)}>Toggle</button>
                        <button className='remove' onClick={() => removeTask(index)}>Remove</button>
                    </li>
                ))}
            </ul>
            </div>

        </div>
        </>
        
    );
}

export default TaskTracker;
