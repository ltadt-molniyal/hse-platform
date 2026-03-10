import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../lib/supabase';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Form6SData {
  factory_id: string;
  department: string;
  category: string;
  issue_text: string;
  request_action: string;
  due_date: string;
}

const FACTORIES = [
  { id: '1', name: 'Xưởng 1' },
  { id: '2', name: 'Xưởng 2' },
  { id: '3', name: 'Xưởng 3' }
];

const CATEGORIES = [
  { code: '6S', name: 'Vệ sinh nhà xưởng 6S' },
  { code: 'FIRE', name: 'PCCC' },
  { code: 'ELEC', name: 'An toàn điện' },
  { code: 'CHEM', name: 'An toàn hóa chất' }
];

export default function Form6S() {
  const { register, handleSubmit, formState: { errors } } = useForm<Form6SData>();
  const [images, setImages] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useAuth();

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsCompressing(true);
      try {
        const file = e.target.files[0];
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          fileType: 'image/webp'
        });
        setImages(prev => [...prev, compressedFile]);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const onSubmit = async (data: Form6SData) => {
    if (images.length === 0) return alert("Cần tối thiểu 1 ảnh vi phạm!");
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reports').insert([{
        created_by: profile?.id,
        factory_id: profile?.factory_id || 'X1',
        status: 'submitted',
        report_data: {
          module: '6S',
          notes: data.issue_text,
          ...data
        }
      }]).select().single();
      
      if (error) throw error;
      alert("Đã ghi nhận vi phạm 6S và tạo Task thành công!");
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi submit!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Biên bản Kiểm tra 6S</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="font-semibold block text-sm">Xưởng vi phạm *</label>
          <select {...register("factory_id", { required: true })} className="w-full border rounded-lg p-3">
            <option value="">Chọn xưởng...</option>
            {FACTORIES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          {errors.factory_id && <span className="text-red-500 text-xs text-sm flex gap-1"><AlertCircle size={14}/> Bắt buộc</span>}
        </div>

        <div className="space-y-2">
          <label className="font-semibold block text-sm">Hạng mục *</label>
          <select {...register("category", { required: true })} className="w-full border rounded-lg p-3">
            <option value="">Chọn hạng mục...</option>
            {CATEGORIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-semibold block text-sm">Mô tả vi phạm *</label>
          <textarea {...register("issue_text", { required: true })} className="w-full border rounded-lg p-3 h-24" placeholder="Ví dụ: Nền nhà có dầu mỡ gây trơn trượt..." />
        </div>

        <div className="space-y-2">
          <label className="font-semibold block text-sm">Yêu cầu cải thiện *</label>
          <input type="text" {...register("request_action", { required: true })} className="w-full border rounded-lg p-3" placeholder="Ví dụ: Vệ sinh ngay lập tức" />
        </div>

        <div className="space-y-2">
          <label className="font-semibold block text-sm">Hạn khắc phục *</label>
          <input type="date" {...register("due_date", { required: true })} className="w-full border rounded-lg p-3" />
        </div>

        <div className="space-y-2">
          <label className="font-semibold block text-sm">Ảnh vi phạm (Tối thiểu 1) *</label>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <img key={idx} src={URL.createObjectURL(img)} className="aspect-square object-cover rounded-lg border" />
            ))}
            <label className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center text-gray-400 bg-gray-50 cursor-pointer">
              <Camera size={24} />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageCapture} disabled={isCompressing} />
            </label>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2">
          {isSubmitting ? 'Đang gửi...' : <><Upload size={20} /> Ghi nhận lỗi</>}
        </button>
      </form>
    </div>
  );
}
