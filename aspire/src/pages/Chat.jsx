import { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { createActor } from '../utils/createActor';
import { HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../utils/backend.did';
import { Principal } from '@dfinity/principal';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [polling, setPolling] = useState(false);

  const pollForAgentAssignment = async (taskId, agentStore) => {
    setPolling(true);
    let timeoutId;
    const pollInterval = setInterval(async () => {
      console.log("polling going on")
      try {
        const assignedAgent = await agentStore.getTaskAgent(taskId);
        // Check if assignedAgent exists and is not null
        if (assignedAgent && assignedAgent.length > 0) {
          const agent = assignedAgent[0]; // Get the Principal
          if (agent) {
            console.log("assignedAgent:", agent);
            clearInterval(pollInterval);
            clearTimeout(timeoutId); // Clear the timeout when we get an agent
            setPolling(false);
            setMessages(prev => [...prev, {
              role: 'system', 
              content: `Task ${taskId} has been assigned to agent: ${agent.toText()}`
            }]);
            return; // Exit the polling
          }
        }
      } catch (error) {
        console.error('Error polling for agent:', error);
        clearInterval(pollInterval);
        clearTimeout(timeoutId);
        setPolling(false);
      }
    }, 2000);

    // Store timeout ID so we can clear it if needed
    timeoutId = setTimeout(() => {
      clearInterval(pollInterval);
      setPolling(false);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'No agent was assigned within timeout period.'
      }]);
    }, 30000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const agent = HttpAgent.createSync({
        host: "https://ic0.app",
      });

      if (process.env.NODE_ENV !== "production") {
        await agent.fetchRootKey();
      }

      const agentStore = createActor(
        "skndj-viaaa-aaaah-qp5oq-cai",
        idlFactory,
        agent
      );

      const taskId = await agentStore.getCurrentTaskId();
      const result = await agentStore.queryAgent(prompt, Principal.fromText("skndj-viaaa-aaaah-qp5oq-cai"), taskId);
      
      if ('ok' in result) {
        setCurrentTaskId(taskId);
        setMessages(prev => [...prev, {
          role: 'system',
          content:"Assigning prompt to agent"
          // content: `Task ID: ${taskId} - Waiting for agent assignment...`
        }]);
        pollForAgentAssignment(taskId, agentStore);
      } else {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Error: ${result.err}`
        }]);
      }
    } catch (error) {
      console.error('Error sending prompt:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Error processing your request. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen py-10 bg-gray-900">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <h1 className="text-4xl font-bold mb-4">AI Agent Router</h1>
              <p className="text-lg">Ask anything, and I'll route your request to the most suitable AI agent.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {polling && index === messages.length - 1 && message.role === 'system' && (
                    <div className="mt-2 flex items-center gap-2">
                      <ClipLoader size={16} color="#9CA3AF" />
                      <span className="text-sm text-gray-400">Finding the best agent...</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && !polling && (
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-lg px-4 py-3">
                <ClipLoader size={20} color="#9CA3AF" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-700 bg-gray-800 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Send a message..."
              className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50 p-2"
              disabled={loading || !prompt.trim()}
            >
              <FiSend size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat; 