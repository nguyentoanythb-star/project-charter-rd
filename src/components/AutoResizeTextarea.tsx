import React, { useEffect, useRef } from 'react';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string | number | readonly string[] | undefined;
  minRows?: number;
  maxRows?: number;
}

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  value,
  onChange,
  minRows = 2,
  className = '',
  placeholder,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, minRows * 22 + 16)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        adjustHeight();
      }}
      placeholder={placeholder}
      className={`w-full overflow-hidden leading-relaxed transition-colors ${className}`}
      style={{ resize: 'vertical' }}
      {...props}
    />
  );
};
