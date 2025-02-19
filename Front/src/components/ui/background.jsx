import React from 'react';

export const BackgroundGrid = ({ className = "" }) => (
  <div className={`absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-[0.03] ${className}`}></div>
);

export const GradientOrbs = ({ className = "" }) => (
  <>
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-primary/5"></div>
    <div className={`absolute -top-20 -left-20 w-[40rem] h-[40rem] bg-primary/30 rounded-full blur-[128px] opacity-20 animate-pulse ${className}`}></div>
    <div className={`absolute -bottom-20 -right-20 w-[40rem] h-[40rem] bg-primary/30 rounded-full blur-[128px] opacity-20 animate-pulse ${className}`} style={{ animationDelay: '1s' }}></div>
  </>
);
