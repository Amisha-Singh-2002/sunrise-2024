import React from 'react';
import { Card, Button, Divider, message } from 'antd';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import Task from '../model/Task';

interface OutCardProps {
  id:number;
  title:string;
  description:string;

  show:boolean;
}

const OutCard: React.FC<OutCardProps> = ({ id,title,description,show }) => {


  const handleApiRequest = async (url: string, method: string, body?: object) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        message.success(`Task ${method.toLowerCase()}d successfully`);
        if (method !== 'PUT') window.location.reload();
        return true;
      } else {
        message.error(`Task ${method.toLowerCase()} failed`);
        return false;
      }
    } catch (error) {
      console.error(`Error during ${method} request:`, error);
      message.error('An error occurred');
      return false;
    }
  };

  const handleTaskAction = (action: 'delete' | 'complete') => {
    if(action === 'delete'){
      return () => handleApiRequest(`/api/tasks/delete?id=${id}`, 'DELETE');
    }
    if(action === 'complete'){
      return () => handleApiRequest('/api/tasks/complete', 'POST', { title });
    }
  //   const config = {
  //     delete: { url: `/api/tasks/delete?id=${id}`, method: 'DELETE' },
  //     complete: { url: '/api/tasks/complete', method: 'POST', body: { title } },
  //   };
  //   const { url, method, body } = config[action];
  //   return () => handleApiRequest(url, method, body);
   };

  const renderContent = () => (
    <div className="text-center">
      <h3 className="font-semibold text-lg">{title}</h3>
      <Divider />
      <div className='flex flex-col justify-center'>
      <p>{description}</p>
      <Button
            icon={<DeleteOutlined />}
            onClick={handleTaskAction('delete')}
            className="bg-[red] h-8 text-white font-sans my-5 flex items-center justify-center"
          >Delete</Button>
      </div>
      
    </div>
  );

  return (
    <Card
      title={`Task ${id}`}
      size="small"
      bordered={false}
      extra={
        <div className="flex space-x-2">
          <Button
            icon={<CheckCircleOutlined />}
            onClick={handleTaskAction('complete')}
            disabled={!show}
            className="bg-[blue] text-white font-sans h-8 my-5 flex items-center justify-center"
          >Done</Button>
          &nbsp;
         
        </div>
      }
      className="bg-white w-full sm:w-[45vw] lg:w-[15vw]"
    >
      {renderContent()}
    </Card>
  );
};

export default OutCard;