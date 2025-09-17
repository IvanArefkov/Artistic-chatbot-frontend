'use client'

import React, { useState, useEffect } from 'react';
import type {tokenDataType} from '@/app/system-message/page'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

type SesstionType = {
    id: string,
    created_at: string
}

const ChatSessionsPage = () => {
  const router = useRouter()
  const [sessions, setSessions] = useState<SesstionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock API URL for demo - replace with your actual API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const tokenData = localStorage.getItem('synclite_token')
      let token = {} as tokenDataType
      if (tokenData) {
        token = JSON.parse(tokenData)
        console.log(token)
      }
      
      const response = await fetch(`${apiUrl}/get-sessions`,{
        headers: {
            'Authorization': `Bearer ${token.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }
      
      const data = await response.json();
      
      setSessions(data);

    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = (sessionId:string) => {
    // Navigate to chat page - adjust URL as needed
    router.push(`/chats/${sessionId}`)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-300">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading chat sessions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-700">
          <div className="text-red-400 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Sessions</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={fetchSessions}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 w-full justify-between">
              <div className='flex gap-2'>
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h1 className="text-2xl font-bold text-white">Chat Sessions</h1>
              </div>
              <Link href={'/'} className='self-end items-center h-fit shadow-md justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-gray-200 bg-gray-600 hover:bg-gray-800 hover:text-white'>
                        Home
                    </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!sessions || sessions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-white mb-2">No chat sessions yet</h3>
            <p className="text-gray-400 mb-6">Start a new conversation to get started</p>
            
          </div>
        ) : (
          <div className="space-y-4">
            { sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Created {session.created_at}</span>
                      </div>
                      <div className="text-xs font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        ID: {session.id}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-500 group-hover:text-gray-300 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )) }
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={fetchSessions}
          className="bg-gray-800 border border-gray-600 text-gray-300 p-3 rounded-full shadow-lg hover:shadow-xl hover:border-gray-500 hover:bg-gray-700 transition-all"
          title="Refresh sessions"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatSessionsPage;