"use client";

const GradientBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="w-full h-full bg-[#FFEEDA] relative overflow-hidden">
        {/* Orange blur circle */}
        <div className="absolute w-[600px] h-[600px] -left-[150px] -top-[150px]">
          <div 
            className="w-full h-full rounded-full bg-[#FF7900] opacity-50"
            style={{
              filter: 'blur(307.955px)'
            }}
          />
        </div>

        {/* Red blur circle */}
        <div className="absolute w-[600px] h-[600px] left-[700px] -top-[150px]">
          <div 
            className="w-full h-full rounded-full bg-[#FF0004] opacity-33"
            style={{
              filter: 'blur(414.954px)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GradientBackground; 