import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const MOCK_TASKS = [
  { id: 1, title: 'Bình chữa cháy hết hạn', location: 'Xưởng 1 - Khu A', priority: 'Critical', status: 'pending', due: 'Hôm nay' },
  { id: 2, title: 'Dầu mỡ trên sàn', location: 'Xưởng 2 - Máy CNC', priority: 'High', status: 'in_progress', due: 'Ngày mai' },
  { id: 3, title: 'Che chắn máy bị hỏng', location: 'Xưởng 1 - Cắt X', priority: 'Medium', status: 'resolved', due: 'Đã xử lý' },
];

export default function TaskList() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Công việc khắc phục</h2>
        <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">3 Tasks</span>
      </div>

      <div className="space-y-4">
        {MOCK_TASKS.map(task => (
          <div key={task.id} className="bg-white border rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1.5",
              task.priority === 'Critical' ? 'bg-red-500' : 
              task.priority === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
            )} />
            
            <div className="pl-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 line-clamp-2">{task.title}</h3>
                {task.status === 'resolved' ? (
                  <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                ) : (
                  <AlertCircle className={task.priority === 'Critical' ? 'text-red-500 shrink-0' : 'text-orange-500 shrink-0'} size={20} />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{task.location}</p>
              
              <div className="flex justify-between items-center text-xs font-medium">
                <span className={cn(
                  "px-2 py-1 rounded-md",
                  task.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                )}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
                
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock size={14} />
                  {task.due}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
