'use client'
import { spectral, fira_sans } from "@/app/fonts"
import { FormEvent, useEffect, useState } from "react";
import SystemMessageComponent from './system-message'
export default function edit_system_message(){

    const [user, setUser] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [token, setToken] = useState<string>('')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    const handleLogin = async (e:FormEvent<HTMLFormElement>)=>{
        try {
            e.preventDefault()
            const formData = new FormData()
            formData.append('username',user)
            formData.append('password',password)
            const response = await fetch(`${apiUrl}/token`,{
                method: 'post',
                body: formData
            })
            if (response.ok){
                const responseData = await response.json()
                console.log(responseData.access_token)
                setToken(responseData.access_token)
                localStorage.setItem('synclite_token',responseData.access_token)
                alert('login successful')
            }
        }
        catch(e){
            console.log(e)
            alert(e)
        }
    }
    useEffect(()=>{
        const localToken = localStorage.getItem('synclite_token')
        if (localToken){
            setToken(localToken)
        }
    },[])
    
    return (
    <div className="bg-gray-800 h-screen text-white">
        
        {token ? <SystemMessageComponent token={token} /> : <form className="flex flex-col gap-2 p-4" onSubmit={handleLogin}>
            <input value={user} onChange={e=>setUser(e.target.value)} type="text" name="Username" placeholder="Username" autoComplete="username" className="border w-fit" />
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" name="Password" placeholder="Password" autoComplete="current-password" className="border w-fit" />
            <button type="submit" className="border w-fit p-2" >Login</button>
        </form>}
    </div>)
}
    
