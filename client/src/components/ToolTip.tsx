import { useState } from 'react'

type ToolTipProps = {
    text: string
    shortcut: string
    children: JSX.Element
}

export default function Tooltip({ text, shortcut, children }: ToolTipProps) {
    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <div className='relative'>
            <div
                className='inline-block'
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {children}
            </div>
            {showTooltip && (
                <div className='absolute top-full left-1/2 transform -translate-x-1/2 py-2 px-4 bg-[#0f1011] text-white rounded-md text-base'>
                    <p className='whitespace-nowrap'>{text}</p>
                    <p className='text-[#8fbcc8]'>{shortcut}</p>
                </div>
            )}
        </div>
    )
}
