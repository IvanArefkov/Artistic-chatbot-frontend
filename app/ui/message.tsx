'use client'

export type MessageType = {
    sender: 'Consultant' | 'User'
    created_at?: Date
    content: string
}

export default function Message({sender, created_at = new Date(), content}: MessageType){
    const formatTime = (date: Date)=>{
        return date.toLocaleTimeString('en-US',{
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    return (
         <div className={`flex items-end ${sender === 'User' ? 'justify-end': ''}`}>
            {sender === 'User' && <p className='text-sm opacity-50 p-1'>{formatTime(created_at)}</p>}
            <div className={`${sender === 'Consultant' ? 'consultant-message': 'user-message'} m-2 p-2 max-w-68` }>
                <p>{content}</p>
            </div>
            {sender === 'Consultant' && <p className='text-sm opacity-50 p-1'>{formatTime(created_at)}</p>}
        </div>
    )
   
}