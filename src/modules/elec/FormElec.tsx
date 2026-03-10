import { useState } from 'react';
import { Camera, Upload, Zap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function FormElec() {
  const { register, handleSubmit } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { profile } = useAuth();
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reports').insert([{
        created_by: profile?.id,
        factory_id: profile?.factory_id || 'X1',
        status: 'submitted',
        report_data: {
          module: 'ELEC',
          ...data
        }
      }]);
      
      if (error) throw error;
      alert("Đã ghi nhận báo cáo an toàn điện vào Database!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi submit!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 pb-20">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
          <Zap size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">An Toàn Điện (ELEC)</h2>
          <p className="text-sm text-gray-500">Biên bản dùng cho Tủ Điện, Tàu tủ, Motor</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
          <label className="flex items-center gap-2 font-bold text-yellow-800">
            <input type="checkbox" className="w-5 h-5 rounded text-yellow-600" required />
            Xác nhận đã cắt điện vùng kiểm tra
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-semibold block text-sm mb-2">1. Hình dáng và vỏ ngoài tủ điện an toàn?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="radio" value="Đạt" {...register("vo_ngoai")} className="w-5 h-5" required/> Đạt</label>
              <label className="flex items-center gap-2 text-red-600"><input type="radio" value="Lỗi" {...register("vo_ngoai")} className="w-5 h-5" /> Lỗi</label>
            </div>
          </div>

          <div>
            <label className="font-semibold block text-sm mb-2">2. Cáp điện có bị hở, đứt, rò rỉ điện?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="radio" value="Đạt" {...register("cap_dien")} className="w-5 h-5" required/> Đạt</label>
              <label className="flex items-center gap-2 text-red-600"><input type="radio" value="Lỗi" {...register("cap_dien")} className="w-5 h-5" /> Lỗi</label>
            </div>
          </div>

          <div>
            <label className="font-semibold block text-sm mb-2">3. Biển báo cảnh báo điện nguy hiểm có đủ?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="radio" value="Đạt" {...register("bien_bao")} className="w-5 h-5" required/> Đạt</label>
              <label className="flex items-center gap-2 text-red-600"><input type="radio" value="Lỗi" {...register("bien_bao")} className="w-5 h-5" /> Lỗi</label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-semibold block text-sm">Hình ảnh minh chứng *</label>
          <div className="grid grid-cols-3 gap-2">
            <label className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center text-gray-400 bg-gray-50 cursor-pointer">
              <Camera size={24} />
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2">
          {isSubmitting ? 'Đang lưu...' : <><Upload size={20} /> Submit An Toàn Điện</>}
        </button>
      </form>
    </div>
  );
}
