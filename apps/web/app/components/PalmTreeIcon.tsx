import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const PalmTreeIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 100 100">
      <g>
        {/* Palm fronds */}
        <path
          d="M50 30 C45 25, 35 20, 25 25 C20 28, 22 35, 30 38 C35 40, 45 35, 50 30"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M50 30 C55 25, 65 20, 75 25 C80 28, 78 35, 70 38 C65 40, 55 35, 50 30"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M50 30 C48 20, 45 10, 35 15 C30 18, 35 25, 42 28 C46 30, 49 25, 50 30"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M50 30 C52 20, 55 10, 65 15 C70 18, 65 25, 58 28 C54 30, 51 25, 50 30"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M50 30 C45 15, 40 5, 30 12 C25 16, 32 22, 38 25 C43 27, 48 22, 50 30"
          fill="currentColor"
          opacity="0.7"
        />
        <path
          d="M50 30 C55 15, 60 5, 70 12 C75 16, 68 22, 62 25 C57 27, 52 22, 50 30"
          fill="currentColor"
          opacity="0.7"
        />
        {/* Trunk */}
        <rect
          x="47"
          y="30"
          width="6"
          height="50"
          fill="currentColor"
          opacity="0.6"
          rx="3"
        />
      </g>
    </SvgIcon>
  );
};

export default PalmTreeIcon;