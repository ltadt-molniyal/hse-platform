import React, { useEffect, useRef, useState } from 'react';
import { Camera, QrCode, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScannerPage() {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Initialize the scanner
    const scanner = new Html5QrcodeScanner(
      "reader", 
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }, 
      /* verbose= */ false
    );

    const onScanSuccess = (decodedText: string) => {
      console.log(`Scan result: ${decodedText}`);
      // Clean up before navigating
      scanner.clear().then(() => {
         // Logic điều hướng dựa trên mã QR
         // Ví dụ mã: "PCCC:BCC-001" hoặc "ELEC:TD-001"
         if (decodedText.startsWith('FIRE') || decodedText.includes('BCC')) {
           navigate(`/pccc/form?id=${decodedText}`);
         } else if (decodedText.startsWith('ELEC') || decodedText.includes('TD')) {
           navigate(`/elec/form?id=${decodedText}`);
         } else if (decodedText.startsWith('6S')) {
           navigate(`/6s/form?id=${decodedText}`);
         } else {
           // Mặc định nhảy về PCCC nếu không rõ loại
           navigate(`/pccc/form?id=${decodedText}`);
         }
      }).catch(err => {
         console.error("Failed to clear scanner", err);
      });
    };

    const onScanFailure = (error: any) => {
      // ignore failures as they occur frequently in real-time scanning
    };

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
      }
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border">
        
        <div className="p-6 bg-primary-600 text-white text-center">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2">
              <QrCode size={24}/> Quét mã QR thiết bị
            </h2>
            <p className="text-sm opacity-80 mt-1">Sử dụng Camera để quét mã trên thiết bị/vị trí</p>
        </div>

        <div className="p-4">
          {/* Vùng Render Camera */}
          <div id="reader" className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50"></div>
          
          {scanError && (
             <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm border border-red-100">
                <AlertCircle size={18} />
                <span>{scanError}</span>
             </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
               <h4 className="font-bold text-blue-800 text-sm mb-1">Hướng dẫn:</h4>
               <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                 <li>Đặt mã QR vào giữa khung hình vuông.</li>
                 <li>Đảm bảo đủ ánh sáng để camera nhận diện tốt nhất.</li>
                 <li>Ứng dụng sẽ tự động chuyển trang khi quét thành công.</li>
               </ul>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 text-gray-500 font-bold hover:bg-gray-50 transition-colors uppercase text-sm tracking-wider"
            >
              Hủy bỏ & quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
