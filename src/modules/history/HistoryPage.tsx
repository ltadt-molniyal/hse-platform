import { useEffect, useState } from 'react';
import { Search, FileText, CheckCircle, XCircle, User as UserIcon, Calendar, MapPin, SearchCheck, Check, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Constants removed due to being replaced by real data

export default function HistoryPage() {
  const [filter, setFilter] = useState('ALL');
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();
  
  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('reports')
        .select(`
          *,
          employees!reports_created_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      
      let fetchedReports = data || [];
      // Filter by module inside JSONB
      if (filter !== 'ALL') {
        fetchedReports = fetchedReports.filter(r => r.report_data?.module === filter || r.report_data?.module?.includes(filter));
      }
      
      setReports(fetchedReports);
    } catch (err) {
      console.error('Lỗi tải báo cáo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const canApprove = profile?.role === 'admin' || profile?.role === 'manager';

  const handleApprove = async () => {
    if (!selectedReport) return;
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: 'verified' })
        .eq('id', selectedReport.id);
      
      if (error) throw error;
      alert("Đã phê duyệt báo cáo thành công!");
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      alert("Lỗi khi phê duyệt!");
    }
  };

  const handleReject = async () => {
    if (!selectedReport) return;
    const reason = prompt("Vui lòng nhập lý do từ chối:");
    if (!reason) return;

    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'rejected', 
          report_data: {
            ...selectedReport.report_data,
            reason: reason,
            notes: `${selectedReport.report_data?.notes || ''}\nLý do từ chối: ${reason}`
          }
        })
        .eq('id', selectedReport.id);
      
      if (error) throw error;
      alert("Đã từ chối báo cáo!");
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      alert("Lỗi khi từ chối!");
    }
  };

  const filteredReports = reports;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 relative h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhật ký kiểm tra</h1>
          <p className="text-gray-500 text-sm mt-1">Lịch sử đánh giá PCCC, 6S, An toàn điện</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
             {['ALL', 'PCCC', '6S', 'ELEC'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", filter === f ? "bg-primary-100 text-primary-700" : "bg-white border text-gray-600 hover:bg-gray-50")}
                >
                  {f === 'ALL' ? 'Tất cả' : f}
                </button>
             ))}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                type="text"
                placeholder="Tìm mã báo cáo..."
                className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b">Mã BC</th>
                <th className="p-4 font-semibold border-b">Ngày</th>
                <th className="p-4 font-semibold border-b">Module</th>
                <th className="p-4 font-semibold border-b">Trạng thái</th>
                <th className="p-4 font-semibold border-b text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {isLoading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-500"><Loader2 className="animate-spin inline mr-2"/> Đang tải dữ liệu...</td></tr>
               ) : filteredReports.length === 0 ? (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-400 italic">Chưa có báo cáo nào được lập.</td></tr>
               ) : filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                     <td className="p-4 font-medium text-primary-600">
                       {r.id.split('-')[0]}... <br/>
                       <span className="text-xs text-gray-500 font-normal">{r.location_name || 'Nghiệp vụ'}</span>
                     </td>
                     <td className="p-4 text-gray-600">
                       {new Date(r.created_at).toLocaleDateString('vi-VN')} <br/>
                       <span className="text-xs text-gray-500 font-normal">{new Date(r.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</span>
                     </td>
                     <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{r.report_data?.module || 'N/A'}</span></td>
                     <td className="p-4">
                        {r.status === 'verified' && <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={14}/> Đã duyệt</span>}
                        {r.status === 'rejected' && <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={14}/> Từ chối</span>}
                        {r.status === 'submitted' && <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold"><SearchCheck size={14}/> Chờ duyệt</span>}
                     </td>
                     <td className="p-4 text-right">
                        <button onClick={() => setSelectedReport(r)} className="text-primary-600 p-2 hover:bg-primary-50 rounded-lg transition-colors inline-flex bg-primary-50/50">
                          <FileText size={18} />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Chi tiết báo cáo {selectedReport.id}</h3>
                <p className="text-sm text-gray-500">{selectedReport.module}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm mb-4">
                <div className="flex gap-2">
                  <UserIcon size={18} className="text-gray-400 shrink-0"/>
                  <div>
                    <p className="text-gray-500 font-medium">Người kiểm tra</p>
                    <p className="font-semibold text-gray-900">{selectedReport.employees?.full_name || 'Staff'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Calendar size={18} className="text-gray-400 shrink-0"/>
                  <div>
                    <p className="text-gray-500 font-medium">Thời gian</p>
                    <p className="font-semibold text-gray-900">{new Date(selectedReport.created_at).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex gap-2 col-span-2">
                  <MapPin size={18} className="text-gray-400 shrink-0"/>
                  <div>
                    <p className="text-gray-500 font-medium">Vị trí</p>
                    <p className="font-semibold text-gray-900">{selectedReport.location_name || 'Chưa xác định'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Kết quả đánh giá</h4>
                <ul className="space-y-3">
                  {selectedReport.report_data && Object.entries(selectedReport.report_data).map(([key, value]: [string, any], idx: number) => {
                    if (key === 'module' || key === 'notes' || key === 'reason') return null;
                    return (
                      <li key={idx} className="flex justify-between items-start gap-4">
                        <span className="text-gray-700 flex-1 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className={cn(
                          "font-bold text-sm whitespace-nowrap px-2 py-0.5 rounded",
                          value === 'Lỗi' || value === 'Hết hạn' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                        )}>
                          {String(value)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {selectedReport.report_data?.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <h4 className="font-semibold text-yellow-800 text-sm mb-1">Ghi chú & Đề xuất:</h4>
                  <p className="text-sm text-yellow-700 whitespace-pre-wrap">{selectedReport.report_data.notes}</p>
                </div>
              )}

              {selectedReport.image && (
                <div className="flex gap-2 mt-2">
                   <img src={selectedReport.image} alt="Report evidence" className="h-32 rounded-lg border shadow-sm object-cover" />
                </div>
              )}
            </div>

            {/* Modal Footer - Approval Actions */}
            {canApprove && selectedReport.status === 'submitted' && (
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                <button 
                  onClick={handleReject}
                  className="px-6 py-2 bg-white text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Từ chối
                </button>
                <button 
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Check size={18} /> Phê duyệt báo cáo
                </button>
              </div>
            )}
            
            {(!canApprove || selectedReport.status !== 'submitted') && (
              <div className="p-4 border-t bg-gray-50 flex justify-end flex-shrink-0">
                 <button onClick={() => setSelectedReport(null)} className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors">
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
