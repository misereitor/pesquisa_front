import { InputHTMLAttributes, forwardRef, useId } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  errortext?: string;
  sendError?: boolean;
};

const InputSimple = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      name = '',
      label = '',
      errortext = '',
      sendError = true,
      ...props
    },
    ref
  ) => {
    const inputId = useId();
    const hasError = errortext.length > 0;
    return (
      <div className="flex flex-col">
        <label htmlFor={inputId} className="mb-1">
          {label}
        </label>
        <input
          id={inputId}
          name={name}
          type={type}
          ref={ref}
          {...props}
          className={`${props.className} ${hasError && 'outline-red-700 outline-none'}`}
        />
        {sendError && (
          <div className="h-6">
            {hasError && (
              <span className="text-red-700 text-sm">{errortext}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

InputSimple.displayName = 'Input';

export default InputSimple;
