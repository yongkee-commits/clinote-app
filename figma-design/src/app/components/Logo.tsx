import logoImage from "figma:asset/c02900cf021aac9ed9b8d16e2a1eb63d813ea2df.png";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export function Logo({ className = "", size = 'md', onClick }: LogoProps) {
  const sizeMap = {
    sm: 'h-5',    // ~20px - for mobile header
    md: 'h-8',    // ~32px - for desktop sidebar
    lg: 'h-10',   // ~40px - for onboarding
    xl: 'h-12',   // ~48px - for login
  };

  return (
    <img 
      src={logoImage} 
      alt="Clinote" 
      className={`${sizeMap[size]} w-auto ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    />
  );
}