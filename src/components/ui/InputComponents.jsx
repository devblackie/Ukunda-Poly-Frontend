// src/components/InputComponents.jsx
import React from 'react';
import { SearchSvg } from './SvgComponents';

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search by title or description',
  className = '',
  ariaLabel = 'Search content',
  ...props
}) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 pl-10 text-sm font-medium text-gray-700 bg-white border border-gray-200 shadow-sm shadow-gray-900 rounded-full focus:outline-0 transition ${className}`}
      aria-label={ariaLabel}
      {...props}
    />
    <SearchSvg />
  </div>
);

export const LabeledInput = ({
    value,
    onChange,
    placeholder = 'Write here...',
    label = 'Input',
    id = 'input',
    type = 'text',
    name = 'input',
    
    ariaLabel = `Enter ${label.toLowerCase()}`,
    ...props
  }) => (
    <div className="flex flex-col w-full static">
      <label
        htmlFor={id}
        className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-2 bg-gray-50 w-fit"
      >
        {label}:
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        // className={`border-blue-500 px-[10px] py-[11px] text-xs bg-gray-50 border-2 rounded-[5px] w-full focus:outline-none placeholder:text-black/25 ${className}`}
        className="w-full p-3 pl-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-0 focus:ring-1 focus:ring-blue-500 transition"

        aria-label={ariaLabel}
        {...props}
      />
    </div>
  );

  export const LabeledTextarea = ({
    value,
    onChange,
    placeholder = 'Write here...',
    label = 'Textarea',
    id = 'textarea',
    name = 'textarea',
    rows = 4,
    className = '',
    ariaLabel = `Enter ${label.toLowerCase()}`,
    ...props
  }) => (
    <div className="flex flex-col w-full static">
      <label
        htmlFor={id}
        className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-2 bg-gray-50 w-fit"
      >
        {label}:
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        rows={rows}
        className={`border-gray-200 p-3 pl-10 text-gray-700 text-sm bg-gray-50 border rounded-lg w-[210px] focus:outline-0 focus:ring-1 focus:ring-blue-500 placeholder:text-black/25 ${className}`}
        aria-label={ariaLabel}
        {...props}
      />
    </div>
  );

  export const LabeledSelect = ({
    value,
    onChange,
    options = [],
    label = 'Select',
    id = 'select',
    name = 'select',
    className = '',
    ariaLabel = `Select ${label.toLowerCase()}`,
    ...props
  }) => (
    <div className="flex flex-col w-fit static">
      <label
        htmlFor={id}
        className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-[#e8e8e8] w-fit"
      >
        {label}:
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        name={name}
        className={`border-blue-500 px-[10px] py-[11px] text-xs bg-[#e8e8e8] border-2 rounded-[5px] w-[210px] focus:outline-none appearance-none ${className}`}
        aria-label={ariaLabel}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
  
  export const LabeledFileInput = ({
    onChange,
    label = 'File',
    id = 'file',
    name = 'file',
    accept,
    className = '',
    ariaLabel = `Upload ${label.toLowerCase()}`,
    ...props
  }) => (
    <div className="flex flex-col w-fit static">
      <label
        htmlFor={id}
        className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-[#e8e8e8] w-fit"
      >
        {label}:
      </label>
      <input
        id={id}
        type="file"
        onChange={onChange}
        name={name}
        accept={accept}
        className={`border-blue-500 px-[10px] py-[11px] text-xs bg-[#e8e8e8] border-2 rounded-[5px] w-[210px] focus:outline-none file:bg-blue-500 file:text-white file:border-none file:rounded file:px-2 file:py-1 file:mr-2 ${className}`}
        aria-label={ariaLabel}
        {...props}
      />
    </div>
  );