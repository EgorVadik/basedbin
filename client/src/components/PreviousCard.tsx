import { Link } from 'react-router-dom'

type cardProps = {
    fileName: string
    fileUrl: string
    dateModified: string
}

function PreviousCard({ dateModified, fileName, fileUrl }: cardProps) {
    return (
        <Link
            to={fileUrl}
            className='flex items-center justify-between w-full p-3 hover:opacity-70'
        >
            <p className='font-medium text-2xl'>{fileName}</p>
            <p className='text-[#B8C6D1] font-medium'>{dateModified}</p>
        </Link>
    )
}

export default PreviousCard
