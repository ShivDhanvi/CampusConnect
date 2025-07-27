import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

export const Icons = {
    google: (props: IconProps) => (
        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
            <title>Google</title>
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7-3.13-7-7s3.13-7 7-7c1.73 0 3.26.58 4.45 1.62l2.4-2.4C17.34 1.34 15.09 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c6.88 0 12-4.94 12-12.24 0-1.02-.12-2.04-.36-3.04h-9.2z"/>
        </svg>
    ),
};
