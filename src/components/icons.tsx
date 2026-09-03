import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 16, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const LogoMark = ({ size = 18, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    <path d="M12 2.5 2.8 7 12 11.5 21.2 7 12 2.5Z" />
    <path d="M2.8 12 12 16.5 21.2 12" />
    <path d="M2.8 16.8 12 21.3l9.2-4.5" />
  </svg>
)

export const DashboardIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </Svg>
)

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
    <path d="M16 2.5v4M8 2.5v4M3 10h18" />
  </Svg>
)

export const WrenchIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
  </Svg>
)

export const BuildingIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 21h18M5 21V7.5l7-4.5 7 4.5V21" />
    <path d="M10 21v-5.5h4V21M9.5 9.5h1M13.5 9.5h1M9.5 12.75h1M13.5 12.75h1" />
  </Svg>
)

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </Svg>
)

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const BellIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 8.5a6 6 0 1 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5Z" />
    <path d="M13.7 20.5a2 2 0 0 1-3.4 0" />
  </Svg>
)

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 21v-1.8a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4V21" />
    <circle cx="12" cy="7.5" r="4" />
  </Svg>
)

export const DownloadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5v11M8 11l4 4 4-4M4.5 19.5h15" />
  </Svg>
)

export const ArrowUpIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Svg>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
)

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Svg>
)

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Svg>
)

export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10.3 3.9 2.4 17.4A1.9 1.9 0 0 0 4 20.3h16a1.9 1.9 0 0 0 1.6-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4M12 17h.01" />
  </Svg>
)

export const BoltIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 2.5 4.8 13.4a.7.7 0 0 0 .55 1.14H11l-.5 6.96 8.7-10.9a.7.7 0 0 0-.55-1.14H13l.5-6.96Z" />
  </Svg>
)

export const MapPinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 10.5c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10.5" r="2.8" />
  </Svg>
)

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </Svg>
)

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 16.9v2.4a1.9 1.9 0 0 1-2.1 1.9 18.9 18.9 0 0 1-8.2-2.9 18.6 18.6 0 0 1-5.7-5.7A18.9 18.9 0 0 1 2.1 4.3 1.9 1.9 0 0 1 4 2.2h2.4a1.9 1.9 0 0 1 1.9 1.6c.12.9.35 1.8.67 2.65a1.9 1.9 0 0 1-.43 2L7.5 9.5a15.2 15.2 0 0 0 5.7 5.7l1.05-1.05a1.9 1.9 0 0 1 2-.43c.85.32 1.75.55 2.65.67A1.9 1.9 0 0 1 21 16.9Z" />
  </Svg>
)

export const FileTextIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 2.8H7.5A2.5 2.5 0 0 0 5 5.3v13.4a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5V7.8L14 2.8Z" />
    <path d="M13.8 3v4.6H19M8.8 12.5h6.4M8.8 16h4.4" />
  </Svg>
)

export const SignalIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={2}>
    <path d="M2 8.6a14 14 0 0 1 20 0M5.4 12.4a9 9 0 0 1 13.2 0M9 16.2a4 4 0 0 1 6 0M12 20h.01" />
  </Svg>
)

export const BatteryIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="8" width="16" height="8" rx="2" />
    <path d="M21 11v2" />
    <rect
      x="4.5"
      y="10"
      width="10"
      height="4"
      rx="1"
      fill="currentColor"
      stroke="none"
    />
  </Svg>
)

export const RefreshIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.5 11a8.5 8.5 0 0 0-14.9-4.4L3 9.5M3.5 13a8.5 8.5 0 0 0 14.9 4.4L21 14.5" />
    <path d="M3 5v4.5h4.5M21 19v-4.5h-4.5" />
  </Svg>
)

export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.8 4.5 6v5.6c0 4.6 3.1 8.9 7.5 10 4.4-1.1 7.5-5.4 7.5-10V6L12 2.8Z" />
    <path d="m9.2 12 2 2 3.6-4" />
  </Svg>
)

export const CameraIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8.5h2.6l1.5-2.4h7.8l1.5 2.4H20a1.8 1.8 0 0 1 1.8 1.8v7.4A1.8 1.8 0 0 1 20 19.5H4a1.8 1.8 0 0 1-1.8-1.8v-7.4A1.8 1.8 0 0 1 4 8.5Z" />
    <circle cx="12" cy="14" r="3.2" />
  </Svg>
)
