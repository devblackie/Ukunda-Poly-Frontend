// src/components/SvgComponents.js
import React from "react";

export const SearchSvg = ({
  className = "absolute left-3 top-3 size-6 text-gray-400",
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
      clipRule="evenodd"
    />
  </svg>
);

export const AllSvg = ({ className = "h-5 w-5 mr-2 text-blue-900" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="100"
    height="100"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFA000"
      d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z"
    ></path>
    <path
      fill="#FFCA28"
      d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z"
    ></path>
  </svg>
);

export const TextSvg = ({ className = "h-5 w-5 mr-2 text-blue-900" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    shape-rendering="geometricPrecision"
    text-rendering="geometricPrecision"
    image-rendering="optimizeQuality"
    fill-rule="evenodd"
    clip-rule="evenodd"
    viewBox="0 0 392 512.303"
  >
    <path
      fill="#26A9F1"
      d="M58.884 0h203.881L392 139.817v313.602c0 32.329-26.555 58.884-58.884 58.884H58.884C26.545 512.303 0 485.809 0 453.419V58.884C0 26.495 26.495 0 58.884 0z"
    />
    <path
      fill="#BCE2F9"
      d="M262.766 0L392 139.816v.175h-55.664c-46.151-.734-70.996-23.959-73.57-62.858V0z"
    />
    <path
      fill="#1C7BB0"
      fill-rule="nonzero"
      d="M107.777 403.337c-7.205 0-13.05-5.844-13.05-13.051 0-7.205 5.845-13.05 13.05-13.05h141.706c7.206 0 13.051 5.845 13.051 13.05 0 7.207-5.845 13.051-13.051 13.051H107.777zm0-152.327c-7.205 0-13.05-5.845-13.05-13.051s5.845-13.05 13.05-13.05h176.447c7.206 0 13.051 5.844 13.051 13.05s-5.845 13.051-13.051 13.051H107.777zm0 73.164c-7.205 0-13.05-5.844-13.05-13.05s5.845-13.051 13.05-13.051h167.099c7.206 0 13.05 5.845 13.05 13.051s-5.844 13.05-13.05 13.05H107.777z"
    />
    <path
      fill="#1F89C3"
      d="M310.106 136.615h-.02L392 204.911v-64.92h-55.664c-9.685-.153-18.43-1.304-26.23-3.376z"
    />
  </svg>
);

export const ImageSvg = ({ className = "h-5 w-5 mr-2 text-blue-900" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="100"
    height="100"
    viewBox="0 0 48 48"
  >
    <polyline fill="#3dd9eb" points="44,41 4,41 4,7 44,7 44,41"></polyline>
    <path
      fill="#6c19ff"
      d="M31.5,11c-1.933,0-3.5,1.567-3.5,3.5s1.567,3.5,3.5,3.5s3.5-1.567,3.5-3.5S33.433,11,31.5,11z"
    ></path>
    <polyline
      fill="#6c19ff"
      points="20.815,17.893 4,40.81 4,41 37.769,41 20.411,41 38,41 20.815,17.893"
    ></polyline>
    <polyline
      fill="#6c19ff"
      points="31.364,24.009 19,40.86 19,41 43.83,41 31.067,41 44,41 31.364,24.009"
    ></polyline>
    <polygon
      fill="#2100c4"
      points="38,41 28.384,28.07 19,40.86 19,41 31.067,41"
    ></polygon>
  </svg>
);

export const VideoSvg = ({ className = "h-5 w-5 mr-2 text-blue-900" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4zm7 4v8l6-4-6-4z" />
  </svg>
);

export const DocumentSvg = ({ className = "h-5 w-5 mr-2 text-blue-900" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 511.81 499.02"
  >
    <defs>
      <style>{`.a{fill:#b30b00;}.b{fill:#fff;}`}</style>
    </defs>
    <title>acrobat-pro</title>
    <path
      className={"a"}
      d="M90.93,0h330a90.87,90.87,0,0,1,90.93,90.93V408.09A90.87,90.87,0,0,1,420.88,499H90.93C41.37,498.82,0,459.05,0,408.09V90.73C0,39.77,39.77,0,90.93,0Z"
    />
    <path
      className={"b"}
      d="M408.09,288.38C384.11,262.8,318.76,274,303,275.59c-22.38-22.38-38.17-47.76-44.57-57.36,8-24,14.39-51,14.39-76.54,0-24-9.59-47.76-35-47.76a25.51,25.51,0,0,0-22.38,12.79c-11.19,19.18-6.4,57.36,11.19,97.13C217,232.62,201.05,275.59,182.06,309c-25.58,9.59-81.34,35-86.13,63.75-1.6,8,1.6,17.58,8,22.38,6.4,6.4,14.39,8,22.38,8,33.38,0,67-46.16,90.94-87.73,19.18-6.39,49.36-16,79.74-20.78,35,32,66.94,36.57,82.93,36.57,22.39,0,30.38-9.59,33.38-17.59C417.48,306,414.49,294.78,408.09,288.38Zm-22.38,16c-1.6,6.39-9.59,12.79-24,9.59-17.59-4.79-33.38-12.79-46.17-24,11.19-1.6,38.17-4.8,57.36-1.6C379.31,290,387.31,294.78,385.71,304.37ZM231,113.11a8.78,8.78,0,0,1,8-4.79c8,0,9.59,9.59,9.59,17.58-1.6,19.19-4.79,39.77-11.19,57.36C224.63,148.29,226.23,122.71,231,113.11Zm-1.6,180.07c8-14.39,17.58-41.37,20.78-51,8,14.39,22.38,30.37,28.78,38.17C280.59,279,251.81,285.18,229.43,293.18ZM175.27,330c-22.19,35-43,57.36-55.76,57.36-1.6,0-4.8,0-6.4-1.6-1.59-3.2-3.19-6.4-1.59-9.59C113.11,363.33,138.7,345.74,175.27,330Z"
    />
  </svg>
);

export const MenuSvg = ({ className = "h-5 w-5 mr-2 text-blue-900" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

export const ChevronSvg = ({ className = "ml-1 h-3 w-3" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5l7 7-7 7"
    />
  </svg>
);
