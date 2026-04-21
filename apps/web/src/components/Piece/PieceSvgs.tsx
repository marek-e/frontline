interface SvgProps {
  fill: string
  stroke: string
}

export function CommanderSvg({ fill, stroke }: SvgProps) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="22.5,5 27,14 37,9 33,20 12,20 8,9 18,14"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="11"
        y="20"
        width="23"
        height="4"
        rx="1"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <rect
        x="9"
        y="24"
        width="27"
        height="7"
        rx="2"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <rect x="9" y="31" width="27" height="3" rx="1" fill={fill} stroke={stroke} strokeWidth="1" />
    </svg>
  )
}

export function GuardSvg({ fill, stroke }: SvgProps) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22.5" cy="11" r="5.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path
        d="M14,34 Q13,21 22.5,21 Q32,21 31,34 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="11"
        y="34"
        width="23"
        height="4"
        rx="2"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <line x1="12" y1="26" x2="16" y2="30" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <line x1="33" y1="26" x2="29" y2="30" stroke={stroke} strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

export function CannonSvg({ fill, stroke }: SvgProps) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="8"
        y="17"
        width="26"
        height="10"
        rx="4"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <rect
        x="32"
        y="19"
        width="6"
        height="6"
        rx="2"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <rect
        x="6"
        y="15"
        width="7"
        height="14"
        rx="3"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path
        d="M10,27 L35,27 L38,33 L7,33 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="34" r="4" fill="none" stroke={stroke} strokeWidth="2" />
      <circle cx="13" cy="34" r="1.5" fill={stroke} />
      <circle cx="32" cy="34" r="4" fill="none" stroke={stroke} strokeWidth="2" />
      <circle cx="32" cy="34" r="1.5" fill={stroke} />
    </svg>
  )
}

export function StrikerSvg({ fill, stroke }: SvgProps) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="21"
        y="10"
        width="3"
        height="26"
        rx="1.5"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.2"
      />
      <polygon
        points="22.5,4 27,12 22.5,18 18,12"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="14"
        y="25"
        width="17"
        height="3"
        rx="1.5"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.2"
      />
      <ellipse cx="22.5" cy="38" rx="5" ry="3" fill={fill} stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}

export function FlankerSvg({ fill, stroke }: SvgProps) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="22.5,6 38,20 30,22 22.5,38 15,22 7,20"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon points="22.5,14 32,22 22.5,30 13,22" fill={stroke} opacity="0.25" />
      <circle cx="22.5" cy="22" r="3" fill={fill} stroke={stroke} strokeWidth="1.2" />
    </svg>
  )
}

export function WarlordSvg({ fill, stroke }: SvgProps) {
  return (
    <svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="22.5,4 26,15 37,11 29,20 40,22.5 29,25 37,34 26,30 22.5,41 19,30 8,34 16,25 5,22.5 16,20 8,11 19,15"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="22.5" cy="22.5" r="7" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <circle cx="22.5" cy="22.5" r="3" fill={stroke} opacity="0.5" />
    </svg>
  )
}
