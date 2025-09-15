'use client'

import { FormEvent, useState, useEffect } from "react"
import { spectral } from "@/app/fonts"

interface SystemMessageProps {
    token: string;
}

export default function SystemMessageComponent({token}:SystemMessageProps ){
    const [system_message, setSystemMessage] = useState<string>('')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const submitNewSystemMessage = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('message',system_message)
            const response = await fetch(`${apiUrl}/edit-system-message`,{
                method: 'post',
                body: formData,
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok){
                const responseMessage = await response.json()
                alert(`${responseMessage}`)
            }
        }
        catch (e){
            console.log(e)
        }
    }
    useEffect(()=>{
            const getSystemMessage = async ()=>{
            try {
            const response =await fetch(`${apiUrl}/get-system-message`,
                {
                    method:'get',
                    headers:{
                    'Authorization': `Bearer ${token}`
                }
                }
            )
            const newMessage:{message: string} = await response.json()
            setSystemMessage(newMessage.message)
        }
        catch (e){
            console.log(e)
        }
        }
        getSystemMessage()
    },[])

    return (
        <div className={`p-4 ${spectral.className}`}>  
            <h1 className="text-2xl">Системное сообщение для AI RAG агента Synclite Beauty</h1>
            <form onSubmit={submitNewSystemMessage}>
                <textarea style={{whiteSpace: 'pre-wrap'}} value={system_message} placeholder="System message" name="system-message" onChange={e=>setSystemMessage(e.target.value)} id="system-message" className="border w-full h-92 p-4"></textarea>
                <button type="submit" className="border w-fit p-2" >Submit</button>
            </form>
        </div>
    )
}