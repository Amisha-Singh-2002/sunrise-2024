import React, { useEffect, useState } from "react";
import OutCard from "./OutCard";
import { Inter } from "next/font/google";
import Task from "@/model/Task";
import { Badge } from "antd";

const inter = Inter({ subsets: ["latin"] });

type FormatDataType = {
  todo: Task[];
  s1: Task[];
  s2: Task[];
};

const fetchData = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data.data;
};

const formatData = async () => {
  const [completedData, activeData, allData] = await Promise.all([
    fetchData("http://localhost:3000/api/tasks/completed"),
    fetchData("http://localhost:3000/api/tasks/active"),
    fetchData("http://localhost:3000/api/tasks/all"),
  ]);

  let todo = allData.filter(
    (item: Task) =>
      item !== undefined &&
      item.id !== undefined &&
      !item.completed &&
      activeData.findIndex((i: Task) => i.id === item.id) === -1
  );

  let s1 = [];
  if (activeData.length === 1) {
    s1.push(activeData[0]);
    if (todo.length > 0) {
      s1.push(todo[0]);
      todo = todo.slice(1);
    }
  } else if (activeData.length > 1) {
    s1 = activeData.slice(0, 2);
    todo = [...activeData.slice(2), ...todo];
  }

  todo = todo.filter(Boolean);

  return {
    todo,
    s1,
    s2: completedData,
  };
};

const TaskSection:React.FC<any> = ({ title, tasks, showBadge = true, render }) => (
  <div className="flex flex-col gap-5">
    <div className="flex gap-2">
      <h3 className="text-center font-semibold text-lg w-[100%]">
        {title}&nbsp;
        {showBadge && (
          <Badge count={tasks.length} showZero color="green" />
        )}
      </h3>
    </div>
    <div className="grid grid-cols-2 gap-4 w-[100vw] lg:w-[30vw]">
      {render(tasks)}
    </div>
  </div>
);

export default function Home() {
  const [data, setData] = useState<FormatDataType>();

  useEffect(() => {
    const fetchAndSetData = async () => {
      const formattedData = await formatData();
      setData(formattedData);
    };
    fetchAndSetData();
  }, []);

  const renderTasks = (tasks: Task[], show: boolean) =>
    tasks.map((task: Task) =>
      task ? (
        <OutCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          show={show}
        />
      ) : null
    );

  return (
    <>
      <h1 className="bg-[white] text-center font-bold text-3xl w-[100%] py-10">Task Board</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-15 my-8 w-screen px-[2vw]">
        {data && (
          <>
            <TaskSection
              title="To-Do"
              tasks={data.todo}
              render={(tasks:any) => renderTasks(tasks, false)}
            />
            <TaskSection
              title="In-Progress"
              tasks={data.s1}
              render={(tasks:any) => (
                <>
                  {renderTasks([tasks[0]], true)}
                  {tasks.length > 1 && tasks[0].group !== tasks[1].group && <br />}
                  {tasks.length > 1 &&
                    renderTasks([tasks[1]], tasks[0].group === tasks[1].group)}
                </>
              )}
            />
            <TaskSection
              title="Completed"
              tasks={data.s2}
              render={(tasks:any) => renderTasks(tasks, false)}
            />
          </>
        )}
      </div>
    </>
  );
}