import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Save, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Giả lập dữ liệu Ngân hàng câu hỏi
const MOCK_QUESTIONS = [
  { id: '1', category: '6S', sub_category: 'Vệ sinh', text: 'Nền nhà có sạch sẽ, không dầu mỡ không?', type: 'score', max_score: 5, active: true },
  { id: '2', category: '6S', sub_category: 'Sắp xếp', text: 'Dụng cụ có để đúng vị trí quy định?', type: 'yes_no', max_score: 1, active: true },
  { id: '3', category: 'FIRE', sub_category: 'BCC', text: 'Khu vực đặt bình chữa cháy có bị che khuất?', type: 'yes_no', max_score: 1, active: true },
  { id: '4', category: 'ELEC', sub_category: 'Tủ điện', text: 'Tủ điện có cảnh báo an toàn và khóa?', type: 'yes_no', max_score: 1, active: true },
  { id: '5', category: 'CHEM', sub_category: 'Lưu trữ', text: 'Có dán nhãn hóa chất đầy đủ không?', type: 'score', max_score: 10, active: true },
];

const CATEGORIES = ['6S', 'FIRE', 'ELEC', 'CHEM', 'MACHINE', 'PPE'];

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const filteredQuestions = questions.filter(q => {
    const matchCategory = filter === 'ALL' || q.category === filter;
    const matchSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleEdit = (q: any) => {
    setIsEditing(q.id);
    setEditForm({ ...q });
  };

  const handleSave = () => {
    if (isEditing === 'new') {
      setQuestions([...questions, { ...editForm, id: Date.now().toString() }]);
    } else {
      setQuestions(questions.map(q => q.id === isEditing ? editForm : q));
    }
    setIsEditing(null);
  };

  const handleCreateNew = () => {
    setIsEditing('new');
    setEditForm({ category: '6S', sub_category: '', text: '', type: 'yes_no', max_score: 1, active: true });
  };

  const toggleActive = (id: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, active: !q.active } : q));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Ngân hàng câu hỏi</h1>
          <p className="text-gray-500 text-sm mt-1">Cấu hình các tiêu chí kiểm tra cho các module (Dynamic Form)</p>
        </div>
        
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Thêm câu hỏi mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <button 
              onClick={() => setFilter('ALL')}
              className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", filter === 'ALL' ? "bg-primary-100 text-primary-700" : "bg-white border text-gray-600 hover:bg-gray-50")}
            >
              Tất cả
            </button>
            {CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setFilter(c)}
                className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", filter === c ? "bg-primary-100 text-primary-700" : "bg-white border text-gray-600 hover:bg-gray-50")}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b">Hạng mục</th>
                <th className="p-4 font-semibold border-b">Phân loại</th>
                <th className="p-4 font-semibold border-b">Nội dung câu hỏi</th>
                <th className="p-4 font-semibold border-b">Kiểu chấm điểm</th>
                <th className="p-4 font-semibold border-b">Trạng thái</th>
                <th className="p-4 font-semibold border-b text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isEditing === 'new' && (
                <tr className="bg-blue-50/50">
                  <td className="p-4">
                    <select className="border rounded p-1" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="p-4"><input className="border rounded p-1 w-full" placeholder="VD: Vệ sinh" value={editForm.sub_category} onChange={e => setEditForm({...editForm, sub_category: e.target.value})} /></td>
                  <td className="p-4"><textarea className="border rounded p-1 w-full" rows={2} placeholder="Nội dung" value={editForm.text} onChange={e => setEditForm({...editForm, text: e.target.value})} /></td>
                  <td className="p-4">
                    <select className="border rounded p-1 mb-1" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}>
                      <option value="yes_no">Đạt/Lỗi (Yes/No)</option>
                      <option value="score">Chấm điểm số</option>
                    </select>
                    {editForm.type === 'score' && <input type="number" className="border rounded p-1 w-16 text-xs" placeholder="Max" value={editForm.max_score} onChange={e => setEditForm({...editForm, max_score: Number(e.target.value)})} />}
                  </td>
                  <td className="p-4"><span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">Hiệu lực</span></td>
                  <td className="p-4 text-right">
                    <button onClick={handleSave} className="text-green-600 p-1 hover:bg-green-50 rounded"><Save size={18} /></button>
                    <button onClick={() => setIsEditing(null)} className="text-gray-400 p-1 hover:bg-gray-50 rounded ml-1"><X size={18} /></button>
                  </td>
                </tr>
              )}
              {filteredQuestions.map(q => isEditing === q.id ? (
                <tr key={q.id} className="bg-blue-50/50">
                  <td className="p-4">
                    <select className="border rounded p-1" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="p-4"><input className="border rounded p-1 w-full" value={editForm.sub_category} onChange={e => setEditForm({...editForm, sub_category: e.target.value})} /></td>
                  <td className="p-4"><textarea className="border rounded p-1 w-full" rows={2} value={editForm.text} onChange={e => setEditForm({...editForm, text: e.target.value})} /></td>
                  <td className="p-4">
                    <select className="border rounded p-1 mb-1" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}>
                      <option value="yes_no">Đạt/Lỗi (Yes/No)</option>
                      <option value="score">Chấm điểm số</option>
                    </select>
                    {editForm.type === 'score' && <input type="number" className="border rounded p-1 w-16 text-xs" value={editForm.max_score} onChange={e => setEditForm({...editForm, max_score: Number(e.target.value)})} />}
                  </td>
                  <td className="p-4"><span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">Đang sửa</span></td>
                  <td className="p-4 text-right">
                    <button onClick={handleSave} className="text-green-600 p-1 hover:bg-green-50 rounded"><Save size={18} /></button>
                    <button onClick={() => setIsEditing(null)} className="text-gray-400 p-1 hover:bg-gray-50 rounded ml-1"><X size={18} /></button>
                  </td>
                </tr>
              ) : (
                <tr key={q.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <span className="font-semibold text-gray-700">{q.category}</span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{q.sub_category}</td>
                  <td className="p-4 text-gray-800 font-medium max-w-md">{q.text}</td>
                  <td className="p-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {q.type === 'yes_no' ? 'Đạt/Lỗi' : `Tối đa ${q.max_score}đ`}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleActive(q.id)}
                      className={cn("text-xs font-semibold px-2 py-1 rounded-full transition-colors", q.active ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700" : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700")}
                    >
                      {q.active ? 'Sử dụng' : 'Đã ẩn'}
                    </button>
                  </td>
                  <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(q)} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button className="text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors ml-1"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              
              {filteredQuestions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Không tìm thấy câu hỏi nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
