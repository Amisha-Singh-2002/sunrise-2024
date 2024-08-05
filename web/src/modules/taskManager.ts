import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";

let tasks: Task[] = [...initialTasks];
let gr = 1;
let nID = tasks[tasks.length - 1].id + 1;

const filterTasks = (predicate: (task: Task) => boolean): Task[] => tasks.filter(predicate);

export const initializeTasks = () => { gr = 1; };

export const getActiveTasks = (): Task[] => {
    const allTasks = getAllTasks();
    const completedTasks = getCompletedTasks();
    if (allTasks.length === 0 || allTasks.length === completedTasks.length) {
        return [];
    }
    const activeTasks = filterTasks(task => task.group === gr && !task.completed);
    if (activeTasks.length === 0) {
        gr++;
        return getActiveTasks();
    }
    return activeTasks;
};

export const getCompletedTasks = (): Task[] => filterTasks(task => task.completed);

export const getAllTasks = (): Task[] => tasks;

export const completeTask = (taskTitle: string): void => {
    const task = tasks.find(t => t.title === taskTitle);
    if (task && !task.completed && task.group === gr) {
        task.completed = true;
        if (filterTasks(t => t.group === gr).every(t => t.completed)) {
            console.log(getActiveTasks());
        }
    }
};

export const createTask = (title: string, description: string, persona: string, group: number): void => {
    tasks.push(new Task(nID++, title, description, persona, group));
    gr = Math.min(group, gr);
    console.log(tasks);
};

export const updateTask = (taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    }
};

export const deleteTask = (taskId: number): void => {
    tasks = filterTasks(t => t.id !== taskId);
};