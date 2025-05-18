import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  error?: string;
  containerClassName?: string;
  inputClassName?: string; 
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      id,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      error,
      className = '', 
      inputClassName = '', 
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    const baseInputStyle =
      'block w-full appearance-none rounded-md border bg-[var(--color-netflix-gray-dark)] text-[var(--color-netflix-gray-light)] placeholder-[var(--color-netflix-gray)] focus:outline-none sm:text-sm';
    
    const paddingStyle = `
      ${LeftIcon ? 'pl-10' : 'pl-3'}
      ${RightIcon ? 'pr-10' : 'pr-3'}
      py-2
    `;

    const borderStyle = error
      ? 'border-[var(--color-netflix-red-dark)] focus:border-[var(--color-netflix-red)] focus:ring-[var(--color-netflix-red)]'
      : 'border-transparent focus:border-[var(--color-netflix-gray)] focus:ring-[var(--color-netflix-gray)]';

    return (
      <div className={`relative ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-netflix-gray-light)] mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {LeftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LeftIcon
                className="h-5 w-5 text-[var(--color-netflix-gray)]"
                aria-hidden="true"
              />
            </div>
          )}
          <input
            type={type}
            id={inputId}
            name={name}
            ref={ref}
            className={`${baseInputStyle} ${paddingStyle} ${borderStyle} ${inputClassName}`}
            {...props}
          />
          {RightIcon && !error && ( 
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <RightIcon
                className="h-5 w-5 text-[var(--color-netflix-gray)]"
                aria-hidden="true"
              />
            </div>
          )}
          {error && ( 
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-[var(--color-netflix-red-dark)]">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-[var(--color-netflix-red-dark)]" id={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
