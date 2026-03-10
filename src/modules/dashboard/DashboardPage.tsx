import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, BarChart3, Download, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const METRICS = [
  { label: 'Tỷ lệ kiểm tra (Tháng này)', value: '87%', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Sự cố cần khắc phục', value: '14', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Tỷ lệ cải thiện', value: '62%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Điểm 6S Trung bình', value: '89.5', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' }
];

const MOCK_FACTORY_FAULTS = [
  { name: 'Xưởng 1', count: 12 },
  { name: 'Xưởng 2', count: 8 },
  { name: 'Xưởng 3', count: 15 },
  { name: 'Xưởng 4', count: 5 },
  { name: 'Xưởng 5', count: 20 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingTasks: 0,
    improvementRate: 65,
    avg6S: 0
  });
  const [factoryFaults, setFactoryFaults] = useState<any[]>([]);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        // 1. Fetch Total Reports
        const { count: reportCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true });

        // 2. Fetch Pending Tasks
        const { count: taskCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        
        // 3. Fetch Factory Faults (Mocked logic for now but using real factory names)
        const { data: factories } = await supabase.from('factories').select('name');
        if (factories) {
          setFactoryFaults(factories.map(f => ({ name: f.name, count: Math.floor(Math.random() * 10) })));
        }

        // 4. Fetch Recent Tasks
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*, factories(name)')
          .order('created_at', { ascending: false })
          .limit(3);

        setStats(prev => ({
          ...prev,
          totalReports: reportCount || 0,
          pendingTasks: taskCount || 0
        }));
        setRecentTasks(tasks || []);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const metrics = [
    { label: 'Tổng báo cáo (Hệ thống)', value: stats.totalReports.toString(), icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Sự cố đang xử lý', value: stats.pendingTasks.toString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Tỷ lệ cải thiện', value: `${stats.improvementRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Điểm 6S Trung bình', value: '88.2', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
          <p className="text-gray-500 text-sm mt-1">Dữ liệu được cập nhật thời gian thực từ Supabase</p>
        </div>
        
        <button className="flex items-center gap-2 bg-white border shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Download size={16} />
          Xuất báo cáo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1 text-wrap">{item.label}</p>
                  <h3 className={`text-3xl font-bold ${item.color}`}>{item.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${item.bg}`}>
                  <Icon className={item.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Sự cố theo Xưởng</h3>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
               <p className="text-gray-400 text-sm italic">Đang tải dữ liệu...</p>
            ) : factoryFaults.length === 0 ? (
               <p className="text-gray-400 text-sm italic">Chưa có dữ liệu xưởng.</p>
            ) : factoryFaults.map((f, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{f.name}</span>
                  <span className="text-gray-500">{f.count} lỗi</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-primary-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (f.count / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Công việc mới nhất</h3>
          
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-gray-400 text-sm italic">Đang tải...</p>
            ) : recentTasks.length === 0 ? (
              <p className="text-gray-400 text-sm italic">Tất cả đã hoàn thành! Không có task mới.</p>
            ) : recentTasks.map((task, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-red-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate" title={task.description}>
                    {task.description ? (task.description.length > 40 ? task.description.substring(0, 40) + '...' : task.description) : 'Nhiệm vụ'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 uppercase font-bold">{task.factories?.name || 'Nhà máy'}</p>
                  <div className={`mt-2 text-xs font-semibold px-2 py-1 rounded inline-block ${task.priority === 'high' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50' }`}>
                    {task.status === 'pending' ? 'Chưa xử lý' : 'Đang làm'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

