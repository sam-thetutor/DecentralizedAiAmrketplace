import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { createActor } from '../../utils/createActor';
import { idlFactory } from '../../../../aspire/src/utils/backend.did';
import Navbar from '../../components/Navbar';
import { _SERVICE } from '../../utils/backend.did.d';
import { PulseLoader } from 'react-spinners';

const ChatWrapper = styled.div`
  padding-top: 5rem;
  min-height: 100vh;
  background-color: #111111;
  color: white;
`;

const ChatContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 5rem);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 2rem;
  padding: 1rem;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  margin: ${props => props.isUser ? '0.5rem 0 0.5rem auto' : '0.5rem auto 0.5rem 0'};
  padding: 1rem;
  border-radius: 1rem;
  background-color: ${props => props.isUser ? '#5dbb63' : 'rgba(255, 255, 255, 0.1)'};
`;

const InputContainer = styled.form`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px #5dbb63;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: #5dbb63;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #4a9550;
  }

  &:disabled {
    background: #2c5730;
    cursor: not-allowed;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

interface Message {
  role: 'user' | 'system';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [polling, setPolling] = useState(false);

  const pollForAgentAssignment = async (taskId: number, agentStore: any) => {
    setPolling(true);
    setLoading(true);

    const pollInterval = setInterval(async () => {
      try {
        const assignedAgent = await agentStore.getTaskAgent(taskId);
        if (assignedAgent && assignedAgent.length > 0) {
          const agent = assignedAgent[0];
          if (agent) {
            clearInterval(pollInterval);
            setPolling(false);
            setLoading(false);
            setMessages(prev => [...prev, {
              role: 'system',
              content: `Task assigned to agent: ${agent.toText()}`
            }]);
            return;
          }
        }
      } catch (error) {
        console.error('Error polling for agent:', error);
        clearInterval(pollInterval);
        setPolling(false);
        setLoading(false);
        setMessages(prev => [...prev, {
          role: 'system',
          content: 'Error checking agent assignment. Please try again.'
        }]);
      }
    }, 2000);

    setTimeout(() => {
      if (pollInterval) {
        clearInterval(pollInterval);
        setPolling(false);
        setLoading(false);
      }
    }, 30000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const agent = new HttpAgent({
        host: "https://ic0.app",
      });

      if (process.env.NODE_ENV !== "production") {
        await agent.fetchRootKey();
      }

      const agentStore = createActor<_SERVICE>(
        "skndj-viaaa-aaaah-qp5oq-cai",
        idlFactory,
        agent
      );

      const taskId = await agentStore.getCurrentTaskId();
      const result = await agentStore.queryAgent(
        input, 
        Principal.fromText("skndj-viaaa-aaaah-qp5oq-cai"), 
        taskId
      );
      
      if ('ok' in result) {
        setCurrentTaskId(Number(taskId));

        // setMessages(prev => [...prev, {
        //   role: 'system',
        //   content: "Assigning prompt to agent"
        // }]);

        pollForAgentAssignment(Number(taskId), agentStore);
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
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ChatWrapper>
        <ChatContent>
          <MessagesContainer>
            {messages.map((message, index) => (
              <MessageBubble key={index} isUser={message.role === 'user'}>
                {message.content}
              </MessageBubble>
            ))}
            {loading && (
              <MessageBubble isUser={false}>
                <LoaderContainer>
                  <PulseLoader color="#ffffff" size={8} />
                </LoaderContainer>
              </MessageBubble>
            )}
          </MessagesContainer>
          
          <InputContainer onSubmit={handleSubmit}>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <SendButton type="submit" disabled={loading || !input.trim()}>
              Send
            </SendButton>
          </InputContainer>
        </ChatContent>
      </ChatWrapper>
    </>
  );
} 