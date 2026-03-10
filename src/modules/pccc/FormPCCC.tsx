import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../lib/supabase';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface BCCFormData {
  ngoai_quan: string;
  ap_suat: string;
  han_su_dung: string;
  ghi_chu: string;
}

export default function FormPCCC() {
  const { register, handleSubmit, formState: { errors } } = useForm<BCCFormData>();
  const [images, setImages] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useAuth();

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsCompressing(true);
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          fileType: 'image/webp',
          initialQuality: 0.8
        };
        const compressedFile = await imageCompression(file, options);
        setImages(prev => [...prev, compressedFile]);
      } catch (error) {
        console.error('Lỗi nén ảnh:', error);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const onSubmit = async (data: BCCFormData) => {
    if (images.length === 0) {
      alert("Cần tối thiểu 1 ảnh!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Lưu báo cáo vào bảng reports
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .insert([
          {
            factory_id: profile?.factory_id || 'X1', 
            created_by: profile?.id,
            status: 'submitted',
            report_data: {
              module: 'FIRE',
              notes: data.ghi_chu,
              ...data
            }
          }
        ])
        .select()
        .single();
        
      if (reportError) throw reportError;

      // 2. Upload hình ảnh
      const uploadPromises = images.map(async (img, idx) => {
        const path = `temp/session_${reportData.id}/img_${idx}.webp`; // Thực tế cần lấy factory_id/report_id
        const { error: uploadError } = await supabase.storage
          .from('report-images')
          .upload(path, img);
          
        if (uploadError) throw uploadError;
        
        return supabase.from('report_images').insert([{
          report_id: reportData.id,
          image_url: path,
          image_type: 'general'
        }]);
      });

      await Promise.all(uploadPromises);

      // Check lỗi để tạo task (mock logic cho ANY field = "Lỗi" hoặc "Hết hạn")
      if (Object.values(data).some(v => v === 'Lỗi' || v === 'Hết hạn')) {
        alert("Phát hiện lỗi, task sẽ tự động được tạo!");
      } else {
        alert("Nộp báo cáo thành công!");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi submit!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-20">
      <div className="p-4 bg-primary-600 text-white font-bold text-lg sticky top-0 z-10">
        Kiểm tra Bình Chữa Cháy (BCC)
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6">
        <div className="space-y-2">
          <label className="font-semibold block">1. Ngoại quan *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" value="Đạt" {...register("ngoai_quan", { required: true })} className="w-5 h-5" /> Đạt
            </label>
            <label className="flex items-center gap-2 text-red-600">
              <input type="radio" value="Lỗi" {...register("ngoai_quan", { required: true })} className="w-5 h-5" /> Lỗi
            </label>
          </div>
          {errors.ngoai_quan && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={16}/> Vui lòng chọn ngoại quan</p>}
        </div>

        <div className="space-y-2">
          <label className="font-semibold block">2. Áp suất *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" value="Đạt" {...register("ap_suat", { required: true })} className="w-5 h-5" /> Đạt
            </label>
            <label className="flex items-center gap-2 text-red-600">
              <input type="radio" value="Lỗi" {...register("ap_suat", { required: true })} className="w-5 h-5" /> Lỗi
            </label>
          </div>
          {errors.ap_suat && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={16}/> Vui lòng chọn áp suất</p>}
        </div>

        <div className="space-y-2">
          <label className="font-semibold block">3. Hạn sử dụng *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" value="Còn hạn" {...register("han_su_dung", { required: true })} className="w-5 h-5" /> Còn hạn
            </label>
            <label className="flex items-center gap-2 text-red-600">
              <input type="radio" value="Hết hạn" {...register("han_su_dung", { required: true })} className="w-5 h-5" /> Hết hạn
            </label>
          </div>
          {errors.han_su_dung && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={16}/> Vui lòng chọn hạn sử dụng</p>}
        </div>

        <div className="space-y-2">
          <label className="font-semibold block">4. Hình ảnh đính kèm (Tối thiểu 1) *</label>
          <div className="grid grid-cols-2 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square border rounded-lg overflow-hidden">
                <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} className="object-cover w-full h-full" />
              </div>
            ))}
            {images.length < 5 && (
              <label className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center text-gray-400 p-2 cursor-pointer bg-gray-50 hover:bg-gray-100">
                <Camera size={24} />
                <span className="text-sm mt-2 text-center">Thêm ảnh</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageCapture} disabled={isCompressing} />
              </label>
            )}
          </div>
          {isCompressing && <p className="text-sm text-blue-500">Đang tối ưu ảnh (WebP - Max 500KB)...</p>}
        </div>

        <div className="space-y-2">
          <label className="font-semibold block">5. Ghi chú</label>
          <textarea {...register("ghi_chu")} className="w-full border rounded-lg p-3 min-h-[100px]" placeholder="Nhập mô tả lỗi nếu có..." />
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isSubmitting || images.length === 0} className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:bg-gray-300">
            {isSubmitting ? 'Đang gửi...' : <><Upload size={20} /> Submit Report</>}
          </button>
        </div>
      </form>
    </div>
  );
}
