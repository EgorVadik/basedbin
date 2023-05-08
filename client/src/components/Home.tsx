import { useNavigate } from 'react-router-dom'
// import { ALT_SERVER_URL } from '../constants/constants'
import localStore from '../utils/localStore'
import PreviousCard from './PreviousCard'

function Home() {
    const navigator = useNavigate()
    const previousUrls = JSON.parse(
        localStorage.getItem('previous') || '[]'
    ) as { id: string; name: string; dateModified: Date }[]

    async function createNewFile() {
        const { newFile, error } = await fetch(
            `${import.meta.env.VITE_API_URL}/api/create-new-file`,
            // window.location.hostname === 'localhost'
            //     ? 'http://localhost:3000/api/create-new-file'
            //     : `${ALT_SERVER_URL}/api/create-new-file`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then((res) => res.json())

        if (error) return
        localStore(newFile._id, newFile.name)
        navigator(`/${newFile._id}`)
    }

    return (
        <div className='grid min-h-screen place-items-center content-center text-white font-crimson'>
            <div className='grid grid-cols-1 md:flex items-center w-[90%] md:w-[700px] rounded-lg bg-[#27333D] h-[400px] shadow-4xl'>
                <div
                    className='bg-[#3B4D5C] text-[#E9EDF1] row-start-2 md:row-start-1 md:grow p-3 md:rounded-l-lg shadow-3xl h-full overflow-y-scroll shadow-black md:rounded-br-none rounded-b-lg'
                    style={{
                        scrollbarWidth: 'none',
                    }}
                >
                    <div className='flex items-center gap-2'>
                        <img src='/icons/previous.svg' alt='History Icon' />
                        <h1 className='text-3xl'>Previous Files</h1>
                    </div>
                    <div className='border-b border-[#27333D] w-full my-2'></div>
                    {previousUrls.map((item) => (
                        <PreviousCard
                            key={item.id}
                            dateModified={new Date(
                                item.dateModified
                            ).toDateString()}
                            fileName={item.name}
                            fileUrl={item.id}
                        />
                    ))}
                </div>
                <div className='w-full md:w-[250px] flex md:flex-col items-center justify-around md:justify-center h-full'>
                    <h1 className='text-[#63819B] text-4xl text-center'>
                        <span className='font-bold'>Based</span>
                        bin
                    </h1>
                    <div className='text-center md:mb-20'>
                        <h2 className='text-3xl text-[#E9EDF1] md:mt-14'>
                            Start a new file
                        </h2>
                        <button
                            onClick={createNewFile}
                            className='bg-[#0A0D10] text-[#E9EDF1] rounded-md w-fit mx-auto md:mt-6 py-1 px-7'
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
