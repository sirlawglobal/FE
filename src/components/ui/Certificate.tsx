import React from 'react';

interface CertificateProps {
  studentName: string;
  courseName: string;
  dateCompleted: string;
  certificateId: string;
  instructorName?: string;
}

export const Certificate: React.FC<CertificateProps> = ({
  studentName,
  courseName,
  dateCompleted,
  certificateId,
  instructorName = "Lead Instructor",
}) => {
  return (
    <div
      id="certificate-container"
      className="bg-white relative overflow-hidden font-sans"
      style={{
        width: '1056px', // 11 inches at 96 DPI (landscape)
        height: '816px', // 8.5 inches at 96 DPI
        boxSizing: 'border-box',
      }}
    >
      {/* Outer Border */}
      <div className="absolute inset-0 border-[20px] border-slate-900 z-10 pointer-events-none" />
      
      {/* Inner Elegant Border */}
      <div className="absolute inset-8 border-[2px] border-primary-teal/40 z-10 pointer-events-none p-1">
        <div className="w-full h-full border-[1px] border-primary-teal/20" />
      </div>

      {/* Modern Gradient Backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-teal/10 via-deep-teal/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-primary-teal/10 via-emerald-500/5 to-transparent rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl" />

      {/* Geometric Accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-slate-900" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-teal" style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }} />

      {/* Main Content Container */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center pt-24 pb-20 px-24 text-center">
        
        {/* Header Ribbon / Logo Area */}
        <div className="mb-12 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-primary-teal/30">
              TF
            </div>
            <span className="text-xl font-bold tracking-[0.25em] text-slate-900 uppercase">
              TalentFlow Academy
            </span>
          </div>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary-teal to-transparent" />
        </div>

        {/* Title */}
        <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          CERTIFICATE OF COMPLETION
        </h1>

        <p className="text-lg text-slate-500 mb-10 tracking-[0.2em] uppercase font-semibold">
          This proudly certifies that
        </p>

        {/* Dynamic Name with custom styling */}
        <div className="relative mb-10 inline-block w-full max-w-3xl">
          <h2 className="text-6xl text-primary-teal drop-shadow-sm font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic' }}>
            {studentName}
          </h2>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>

        <p className="text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed font-medium">
          Has steadfastly completed all coursework, assignments, and requirements to graduate from the comprehensive program:
        </p>

        <h3 className="text-3xl font-bold text-slate-900 mb-auto px-12 py-4 bg-slate-50/80 rounded-2xl border border-slate-200/50 shadow-sm backdrop-blur-sm">
          {courseName}
        </h3>

        {/* Footer info (Date, Seal, Signature) */}
        <div className="w-full flex justify-between items-end mt-16 px-12">
          
          {/* Date Section */}
          <div className="text-center w-64">
            <p className="text-xl font-bold text-slate-800 border-b-2 border-slate-900 pb-2 mb-3">
              {dateCompleted}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Date Awarded</p>
          </div>
          
          {/* Official Seal */}
          <div className="text-center relative -mt-12 flex flex-col items-center">
            {/* Seal Graphic */}
            <div className="relative flex items-center justify-center w-36 h-36 mb-4">
              {/* Outer jagged edge (simulated with rotated squares) */}
              <div className="absolute inset-0 bg-primary-teal rotate-12 rounded-lg" />
              <div className="absolute inset-0 bg-primary-teal rotate-45 rounded-lg" />
              <div className="absolute inset-0 bg-primary-teal rotate-75 rounded-lg" />
              <div className="absolute inset-0 bg-primary-teal hover:rotate-90 transition-transform duration-1000 rounded-lg" />
              
              {/* Inner Circle */}
              <div className="absolute inset-1.5 bg-slate-900 rounded-full flex flex-col items-center justify-center border-2 border-primary-teal/50 shadow-inner">
                <span className="text-primary-teal font-black text-2xl tracking-tighter">TF</span>
                <span className="text-white text-[8px] font-bold tracking-widest uppercase mt-1">Official</span>
                <span className="text-white text-[8px] font-bold tracking-widest uppercase">Verified</span>
              </div>
            </div>
            
            <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200 text-[10px] text-slate-500 font-mono tracking-widest shadow-sm">
              ID: {certificateId.split('-')[0].toUpperCase()}
            </span>
          </div>

          {/* Signature Section */}
          <div className="text-center w-64">
            <div className="border-b-2 border-slate-900 pb-2 mb-3 h-10 flex items-end justify-center">
              {/* Simulated Signature Font */}
              <span className="text-3xl text-slate-800 -rotate-3 translate-y-2 opacity-80" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                {instructorName}
              </span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Instructor Signature</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Certificate;
