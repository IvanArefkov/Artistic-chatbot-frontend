'use client'
export type tokenDataType = {
    token: string,
    expiration: Date
} 
import { FormEvent, useEffect, useState } from "react";
import SystemMessageComponent from './system-message'
export default function EditSystemMessage(){

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
                setToken(responseData.access_token)
                localStorage.setItem('synclite_token',JSON.stringify({
                    token: responseData.access_token,
                    expiration: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }))
                alert('login successful')
            }
        }
        catch(e){
            console.log(e)
            alert(e)
        }
    }
    useEffect(()=>{
        const now:Date = new Date()
        const localdata = localStorage.getItem('synclite_token')
        if (localdata) {
        const localToken = JSON.parse(localdata);
        const expirationDate = new Date(localToken.expiration); // Convert string back to Date
        
        if (now < expirationDate) { // Check if token is still valid (not expired)
            setToken(localToken.token); // Set the token, not the whole object
        } else {
            // Token expired, remove it
            localStorage.removeItem('synclite_token');
            setToken('')
        }
    } 
    },[token,apiUrl])
    
    return (
    <div className="bg-gray-800 h-screen text-white">
        
        {token ? <SystemMessageComponent token={token} /> : <form className="flex flex-col gap-2 p-4" onSubmit={handleLogin}>
            <input value={user} onChange={e=>setUser(e.target.value)} type="text" name="Username" placeholder="Username" autoComplete="username" className="border w-fit" />
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" name="Password" placeholder="Password" autoComplete="current-password" className="border w-fit" />
            <button type="submit" className="border w-fit p-2" >Login</button>
        </form>}
    </div>)
}
    
