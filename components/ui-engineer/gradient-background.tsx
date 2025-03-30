"use client";

import { usePathname } from 'next/navigation';

const GradientBackground = () => {
  const pathname = usePathname();
  
  // Danh sách các đường dẫn không muốn hiển thị gradient
  const excludePaths = [
    '/themes',
    // Thêm các đường dẫn khác vào đây
  ];

  // Kiểm tra xem đường dẫn hiện tại có trong danh sách loại trừ không
  const shouldShowGradient = !excludePaths.some(path => pathname.startsWith(path));

  if (!shouldShowGradient) {
    return null;
  }

  return (
    <div className="absolute inset-0 -z-10">
      {/* <div className="w-full h-full bg-[#FFF5E9] relative overflow-hidden"> */}
      <div className="w-full h-full bg-[#FFF5E9] relative overflow-hidden">
        {/* Orange blur circle */}
        <div className="absolute w-[800px] h-[800px] -left-[200px] -top-[200px]">
          <div 
            className="w-full h-full rounded-full bg-[#FF7900] opacity-30"
            style={{
              filter: 'blur(250px)'
            }}
          />
        </div>

        {/* Red blur circle */}
        <div className="absolute w-[800px] h-[800px] right-[0px] -top-[200px]">
          <div 
            className="w-full h-full rounded-full bg-[#FF6B6B] opacity-20"
            style={{
              filter: 'blur(250px)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GradientBackground; 