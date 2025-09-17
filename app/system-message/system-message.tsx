'use client'

import { FormEvent, useState, useEffect } from "react"
import { spectral } from "@/app/fonts"
import Link from "next/link";

export type SystemMessageProps = {
    token: string;
}
interface PromptResponse {
    system_message: string
    lead_discovery_prompt: string
    use_rag_prompt: string
}
type SelectedSection = 'system-message' | 'use-RAG'

export default function SystemMessageComponent({token}:SystemMessageProps ){
    const [activeSection, setActiveSection]= useState<SelectedSection>('system-message')
    const [system_message, setSystemMessage] = useState<string>('')
    const [lead_discovery_prompt,setLeadDiscovery] = useState<string>('')
    const [useRagPrompt, setUseRagPrompt] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    const sectionConfig = {
        'use-RAG': {
            value: useRagPrompt,
            setter: setUseRagPrompt,
            label: 'Knowledge Base',
            name: 'Промпт классификации сообщений',
            placeholder: 'Enter the knowledge base prompt...',
            icon: '📚'
        },
        'system-message': {
            value: system_message,
            setter: setSystemMessage,
            label: 'System Message',
            name: "Системный промпт",
            placeholder: 'Enter the system message for the AI agent...',
            icon: '⚙️'
        }
    }

    const currentSection = sectionConfig[activeSection]

    const submitNewSystemMessage = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setIsLoading(true)
        
        try {
            const formData = new FormData()
            formData.append('message', currentSection.value)
            formData.append('label', currentSection.label)

            const response = await fetch(`${apiUrl}/edit-system-message`,{
                method: 'post',
                body: formData,
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok){
                const responseMessage = await response.json()
                alert('Successfully updated!')
            }
        }
        catch (e){
            console.log(e)
            alert('Error updating message')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        const getSystemMessage = async ()=>{
            try {
                const response = await fetch(`${apiUrl}/get-system-message`,
                    {
                        method:'get',
                        headers:{
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )
                const newMessage: PromptResponse = await response.json()
                setSystemMessage(newMessage.system_message)
                setLeadDiscovery(newMessage.lead_discovery_prompt)
                setUseRagPrompt(newMessage.use_rag_prompt)
            }
            catch (e){
                console.log(e)
            }
        }
        getSystemMessage()
    },[token])

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 ${spectral.className}`}>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        AI RAG Agent Configuration
                    </h1>
                    <p className="text-gray-300">
                        Configure prompts for Synclite Beauty AI agent
                    </p>
                    
                </div>
                <Link href={'/chats'} className='items-center h-fit shadow-md justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-gray-200 bg-gray-600 hover:bg-gray-800 hover:text-white'>
                        Chats
                    </Link>
                    </div>

                {/* Tab Navigation */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-1 mb-6">
                    <div className="flex gap-1">
                        {Object.entries(sectionConfig).map(([key, config]) => (
                            <button
                                key={key}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                    activeSection === key
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                                onClick={() => setActiveSection(key as SelectedSection)}
                            >
                                <span className="text-lg">{config.icon}</span>
                                <span className="hidden sm:inline">{config.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                    <div className="bg-gray-750 px-6 py-4 border-b border-gray-700">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <span className="text-2xl">{currentSection.icon}</span>
                            {currentSection.name}
                        </h2>
                    </div>

                    <form onSubmit={submitNewSystemMessage} className="p-6">
                        <div className="mb-6">
                            <label 
                                htmlFor="prompt-textarea" 
                                className="block text-sm font-medium text-gray-300 mb-2"
                            >
                                Prompt Content
                            </label>
                            <textarea
                                id="prompt-textarea"
                                value={currentSection.value}
                                placeholder={currentSection.placeholder}
                                onChange={e => currentSection.setter(e.target.value)}
                                className="w-full h-64 p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 font-mono text-sm leading-relaxed text-gray-100 placeholder-gray-400"
                                style={{whiteSpace: 'pre-wrap'}}
                            />
                            <div className="mt-2 text-sm text-gray-400">
                                Characters: {currentSection.value.length}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button 
                                type="submit" 
                                disabled={isLoading || !currentSection.value.trim()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span>💾</span>
                                        Save Changes
                                    </>
                                )}
                            </button>
                            
                            <div className="text-sm text-gray-400">
                                Last modified: {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            ⚙️ System Message
                        </h3>
                        <p className="text-sm text-gray-300">
                            Core instructions that define the AI agent&apos;s behavior and personality
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            🔍 Lead Discovery
                        </h3>
                        <p className="text-sm text-gray-300">
                            Prompts for identifying and qualifying potential leads
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            📚 Knowledge Base
                        </h3>
                        <p className="text-sm text-gray-300">
                            Instructions for retrieving and using knowledge base information
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}