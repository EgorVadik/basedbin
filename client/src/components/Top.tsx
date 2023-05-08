import { Link } from 'react-router-dom'
import Tooltip from './ToolTip'
import { useEffect } from 'react'
import { sleep } from './NewFileContent'

type Props = {
    onSave?: () => void
    onCopy?: () => void
}

function Top({ onSave, onCopy }: Props) {
    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's' && onSave) {
                e.preventDefault()
                if (e.repeat) return

                sleep(500).then(() => {
                    onSave()
                })
            }

            if (e.ctrlKey && e.key === 'q' && onCopy) {
                e.preventDefault()
                if (e.repeat) return
                onCopy()
            }
        })
    }, [onSave, onCopy])

    return (
        <div className='fixed z-10 top-0 left-0 right-0 grid bg-[#27333D] text-[#94A9BA] text-2xl w-fit ml-auto items-center px-12 py-2 rounded-bl-2xl font-crimson'>
            <Link to={'/'}>
                <span className='font-bold'>Based</span>
                bin
            </Link>
            <div className='flex justify-center gap-2 mt-2'>
                <Tooltip text='Save' shortcut='ctrl+s'>
                    <button
                        disabled={onSave === undefined}
                        onClick={onSave}
                        className={`${
                            onSave === undefined && 'cursor-not-allowed'
                        }`}
                    >
                        <img
                            src='/src/assets/icons/save.svg'
                            width={25}
                            height={25}
                            alt='save'
                        />
                    </button>
                </Tooltip>

                <Tooltip text='Share URL' shortcut='ctrl+q'>
                    <button
                        disabled={onCopy === undefined}
                        onClick={onCopy}
                        className={`${
                            onCopy === undefined && 'cursor-not-allowed'
                        }`}
                    >
                        <img
                            src='/src/assets/icons/copy.svg'
                            width={25}
                            height={25}
                            alt='copy'
                        />
                    </button>
                </Tooltip>
            </div>
        </div>
    )
}

export default Top
