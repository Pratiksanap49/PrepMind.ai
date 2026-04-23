export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Top Left Blob */}
      <div className="absolute -top-[20%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-primary/20 blur-[100px] animate-blob" />
      
      {/* Bottom Right Blob */}
      <div className="absolute -bottom-[20%] -right-[10%] h-[50vw] w-[50vw] rounded-full bg-cyan-600/10 blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
      
      {/* Center ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[80vw] w-[80vw] rounded-full bg-violet-600/5 blur-[120px]" />
    </div>
  );
}
