export const GeometricBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated geometric shapes */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-accent rounded-sm rotate-45 animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-20 w-8 h-1 bg-primary animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-60 left-1/3 w-3 h-3 border border-accent animate-float opacity-30" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-40 right-1/4 w-5 h-5 bg-accent/40 rotate-12 animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 right-10 w-2 h-8 bg-primary/60 animate-float" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-20 left-1/2 w-4 h-4 border-2 border-accent rounded-full animate-float opacity-40" style={{ animationDelay: '2.5s' }}></div>
      
      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(180 100% 50%)" />
            <stop offset="100%" stopColor="hsl(217 91% 60%)" />
          </linearGradient>
        </defs>
        <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse" />
        <line x1="80%" y1="10%" x2="20%" y2="90%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }} />
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="url(#lineGradient)" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '2s' }} />
      </svg>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
    </div>
  );
};