import { ButtonHTMLAttributes } from 'react';
import { LuCircleDashed } from 'react-icons/lu';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading: boolean;
  children: React.ReactNode;
};

export default function LoadingButton({
  loading,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      type={props.type ?? 'button'}
      className={`py-2.5 px-6 mr-2 text-sm font-medium text-[#7f5d00] bg-[#ffe45f] rounded 
        hover:bg-[#fce98c] hover:text-[#7f5d00] inline-flex items-center justify-center
        disabled:bg-[#fdf9e5] disabled:cursor-default ${className || ''}`}
    >
      {loading ? (
        <div>
          {' '}
          <LuCircleDashed
            size={16}
            className="absolute text-[#7f5d00] animate-spin -ml-5 mt-px"
          />{' '}
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
