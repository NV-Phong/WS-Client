import { HTMLAttributes } from 'react';

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: number;
  color?: string;
}

export const Icon = ({ name, size = 24, color = 'var(--icon)', ...props }: IconProps) => {
  return (
    <div 
      style={{ 
        width: size, 
        height: size,
        maskImage: `url(/icons/${name}.svg)`,
        WebkitMaskImage: `url(/icons/${name}.svg)`,
        backgroundColor: color,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center'
      }}
      {...props}
    />
  );
};

export default Icon; 