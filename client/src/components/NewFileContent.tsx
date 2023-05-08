/* eslint-disable @typescript-eslint/no-unused-vars */
import io, { Socket } from 'socket.io-client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ALT_SERVER_URL, BASE_SERVER_URL } from '../constants/constants'
import localStore from '../utils/localStore'
import Top from './Top'

let socket: Socket

function NewFileContent() {
    const navigator = useNavigate()
    const textRef = useRef<HTMLTextAreaElement>(null)
    const { id } = useParams()
    const containerRef = useRef<HTMLDivElement>(null)
    const [content, setContent] = useState('')
    const [name, setName] = useState('')
    const [saved, setSaved] = useState(false)
    const [date, setDate] = useState<Date | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetch(
            window.location.hostname === 'localhost'
                ? `http://localhost:3000/api/get-file?id=${id}`
                : `${ALT_SERVER_URL}/api/get-file?id=${id}`
        )
            .then((res) => res.json())
            .then((data) => {
                localStore(id as string, data.file.name)
                setContent(data.file.content)
                setName(data.file.name)
                setDate(new Date(data.file.lastModified))
            })
            .catch(() => navigator('/'))
    }, [id, navigator])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useEffect((): any => {
        if (!id) return

        textRef.current?.focus()

        socket = io(
            window.location.hostname === 'localhost'
                ? BASE_SERVER_URL
                : ALT_SERVER_URL
        )

        socket.on('connect', () => {
            console.log('connected ', socket.id)
            socket.emit('join-room', id)
        })

        socket.on('update-content', (data: string) => {
            setContent(data)
        })

        socket.on('disconnect', () => {
            console.log('disconnected')
        })

        return () => socket.close()
    }, [id])

    useLayoutEffect(() => {
        const textarea = textRef.current
        if (textarea) {
            const height = Math.max(
                32,
                textarea.scrollHeight,
                textarea.clientHeight
            )
            textarea.style.height = `${height}px`
        }
    }, [content])

    async function handleSave() {
        if (saved) return

        const { error } = await fetch(
            window.location.hostname === 'localhost'
                ? 'http://localhost:3000/api/save-file'
                : `${ALT_SERVER_URL}/api/save-file}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, content, name }),
            }
        ).then((res) => res.json())

        if (error) return

        const prevStorage = JSON.parse(
            localStorage.getItem('previous') || '[]'
        ) as { id: string; name: string; dateModified: Date }[]

        if (prevStorage.length === 0) {
            localStore(id as string, name)
            return
        }

        const newStorage = prevStorage.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    name,
                    dateModified: new Date(),
                }
            }
            return item
        })
        localStorage.setItem('previous', JSON.stringify(newStorage))
        setSaved(true)
        setDate(new Date())
    }

    function handleCopy() {
        setCopied(true)
        window.navigator.clipboard.writeText(location.href)
        sleep(4000).then(() => setCopied(false))
    }

    return (
        <>
            <div className='flex font-crimson text-3xl font-bold text-[#DBE2E8] pt-3 mx-16'>
                <input
                    type='text'
                    value={name}
                    className='bg-transparent outline-none'
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <Top onSave={handleSave} onCopy={handleCopy} />
            <div
                ref={containerRef}
                className='mx-16 py-4 min-h-screen relative font-roboto'
            >
                <div className='absolute -left-12 top-4 text-[#777778]'>
                    {/* &gt; */}
                    {content.split('\n').map((_, i) => (
                        <p key={i}>{i + 1}</p>
                    ))}
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                    <textarea
                        ref={textRef}
                        className='h-[90vh] outline-none resize-none bg-transparent text-[#DBE2E8]'
                        value={content}
                        onChange={(e) => {
                            if (!socket.active) {
                                return
                            }
                            socket.emit('content-change', e.target.value, id)
                            setContent(e.target.value)
                            if (saved) setSaved(false)
                        }}
                    ></textarea>
                    <div>
                        <ReactMarkdown
                            children={content}
                            className='prose text-[#DBE2E8] break-words'
                            components={{
                                h1: ({ node, ...props }) => (
                                    <h1 className='text-[#DBE2E8]' {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2 className='text-[#DBE2E8]' {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3 className='text-[#DBE2E8]' {...props} />
                                ),
                                h4: ({ node, ...props }) => (
                                    <h4 className='text-[#DBE2E8]' {...props} />
                                ),
                                h5: ({ node, ...props }) => (
                                    <h5 className='text-[#DBE2E8]' {...props} />
                                ),
                                h6: ({ node, ...props }) => (
                                    <h6 className='text-[#DBE2E8]' {...props} />
                                ),
                                strong: ({ node, ...props }) => (
                                    <strong
                                        className='text-[#DBE2E8]'
                                        {...props}
                                    />
                                ),
                                blockquote: ({ node, ...props }) => (
                                    <blockquote
                                        className='text-[#DBE2E8]'
                                        {...props}
                                    />
                                ),
                                a: ({ node, ...props }) => (
                                    <a
                                        className='text-blue-500 underline'
                                        {...props}
                                    />
                                ),
                                tr: ({ node, ...props }) => (
                                    <tr className='text-[#DBE2E8]' {...props} />
                                ),
                                th: ({ node, ...props }) => (
                                    <th className='text-[#DBE2E8]' {...props} />
                                ),
                                code({
                                    node,
                                    inline,
                                    className,
                                    children,
                                    ...props
                                }) {
                                    const match = /language-(\w+)/.exec(
                                        className || ''
                                    )
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            {...props}
                                            children={String(children).replace(
                                                /\n$/,
                                                ''
                                            )}
                                            style={dark}
                                            language={match[1]}
                                            PreTag='div'
                                        />
                                    ) : (
                                        <code {...props} className={className}>
                                            {children}
                                        </code>
                                    )
                                },
                            }}
                            remarkPlugins={[remarkGfm]}
                        />
                    </div>
                </div>
                <div className='fixed px-4 w-full bottom-0 right-0 text-base font-bold bg-[#27333D] text-[#94A9BA] text-center flex items-center justify-between font-crimson'>
                    {date != null && (
                        <p className='text-sm'>
                            Last modified:{' '}
                            {`${date.toDateString()}, ${date.toLocaleTimeString()}`}
                        </p>
                    )}
                    <div>
                        {saved ? (
                            <div className='flex items-center gap-1'>
                                <img
                                    src='./src/assets/icons/check-mark.svg'
                                    alt='Check mark'
                                />
                                <p>Saved</p>
                            </div>
                        ) : (
                            'Unsaved'
                        )}
                    </div>
                </div>
                {copied && (
                    <div className='fixed transform -translate-x-1/2 -translate-y-1/2 bottom-0 left-1/2 bg-[#1e1e1e] text-[#DBE2E8] rounded p-3 shadow-lg'>
                        Link copied to clipboard
                    </div>
                )}
            </div>
        </>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export default NewFileContent
