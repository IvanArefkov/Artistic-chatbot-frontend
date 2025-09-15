'use client'
import { useEffect, useRef } from 'react';
import { spectral, fira_sans } from "@/app/fonts"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Message from './message';
import { useState } from 'react';
import type { MessageType } from '@/app/ui/message'
import Link from 'next/link'
gsap.registerPlugin(useGSAP)


const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Chatbot(){

    const [messages,setMessages]= useState<MessageType[]>([])
    const [inputValue, setinputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    
    async function handleSendMessage (){
         if (!inputValue.trim()) {
            setinputValue('')
            return
         }

         setIsLoading(true)
         setMessages(prev => [...prev, {
            sender: 'User',
            content: inputValue,
         }])

         const lastNMessages = messages.slice(-10) //get last 10 messages context
         const messageHistory = lastNMessages.reduce((accumulator, currentValue)=>{
            return accumulator + `Отправитель: ${currentValue.sender}, Сообщение: ${currentValue.content}`
         },'')
         const userMessage = inputValue

         setinputValue(''.trim())
         try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    history: messageHistory,
                    message: userMessage
                })
            })
        
        if (!response.ok) return
        const data = await response.json()
        const responseMessage: MessageType = {
            sender: 'Consultant',
            content: data
        }
        setMessages(prev => [...prev, responseMessage])
        
        }
         catch (e){
            console.log('error sending a message',e)
        }
        finally {
            setIsLoading(false)
        }
        console.log(messages)
    }

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior:'smooth'})
    },[messages])

    const chatRef = useRef(null)

   
    useGSAP(()=>{
        gsap.from(chatRef.current,{
            autoAlpha: 0,
            duration: 2,
            ease: 'power2.out',
            delay: 3.5,
        })
    })

    return(
        <div ref={chatRef} className="chat-wrapper h-140 max-h-screen w-92 flex flex-col" style={{backgroundColor: 'var(--base-custom)'}}>
           <div style={{backgroundColor: 'var(--accent-custom)',borderBottomColor:'var(--base-custom)', borderBottomWidth: '1px' }} className='flex'>
                <h2 className={ `${spectral.className} text-title p-4 text-white`}>Онлайн-консультант</h2>
                <Link className="inline-flex items-center px-3 py-2 border m-4 text-white font-medium text-center rounded-lg hover:bg-[#7a6c54] focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                    href="/system-message">
                    Prompt Editor
                </Link>
           </div>
           <div className={`flex-1 overflow-y-scroll no-scrollbar ${fira_sans.className}`}>
                <div className='flex pt-1'>
                    <p className='mx-2 text-sm'>консультант</p> 
                    <div className='online self-center' />
                </div>
                <Message sender='Consultant' content='Здравствуйте, у вас возникли вопросы? Мы с удовольствием ответим!' />
                <ul>
                    {messages.map((message, index) => {
                        return <li key={index}><Message sender={message.sender} content={message.content} /></li>
                    })}
                    { isLoading && <div className="ticontainer p-4">
                                    <div className="tiblock">
                                        <div className="tidot"></div>
                                        <div className="tidot"></div>
                                        <div className="tidot"></div>
                                    </div>
                                    </div>}
                </ul>
                <div ref={bottomRef} className='h-12'></div>

           </div>
           <div className='min-h-18 flex justify-between px-4' style={{backgroundColor: 'white'}}>
                <textarea value={inputValue} onChange={e=>setinputValue(e.target.value)} id="user-input" placeholder='Напишите свой вопрос...' className={`w-fit flex-1 text-gray-700 border-b-1 border-b-gray-400 my-3 me-2 ${fira_sans.className}`} style={{resize: 'none'}} />
                <button onClick={handleSendMessage} disabled={isLoading} className='border p-3 h-fit self-center text-gray-500 border-gray-400 hover:cursor-pointer hover:bg-[#B29D78] hover:border-0 hover:text-white'>Отправить</button>
           </div>
        </div>
    )
}