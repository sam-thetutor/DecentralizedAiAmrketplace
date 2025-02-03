import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
      import { createActor } from '../../utils/createActor';
  import { _SERVICE ,idlFactory} from '../../utils/backend.did.d';
  import {idlFactory as dd } from "../../../../aspire/src/utils/backend.did"


interface AgentDescription {
  description: {
    output: { _type: string; description: string };
    expertise: string;
    input: { _type: string; description: string };
  };
}

interface Agent {
  metadata: AgentDescription;
  Price: bigint;
  reputation: bigint;
}

const AgentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const AgentCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  background: rgba(93, 187, 99, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
`;

const AgentInfo = styled.div`
  flex: 1;
`;

const AgentId = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-family: monospace;
  word-break: break-all;
`;

const AgentDescription = styled.p`
  color: white;
  margin-bottom: 1rem;
`;

const AgentStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const AgentList = () => {
  const [agents, setAgents] = useState<[Principal, Agent][]>([]);
  const [loading, setLoading] = useState(true);
  const agentStoreId = "skndj-viaaa-aaaah-qp5oq-cai";

  const fetchAgents = async () => {
    try {
      const agent = new HttpAgent({
        host: "https://ic0.app",
      });



      if (process.env.NODE_ENV !== "production") {
        await agent.fetchRootKey();
      }

      const agentStore = Actor.createActor<_SERVICE>(dd, {agent, canisterId: agentStoreId});
      const agentsData = await agentStore.getAllAgentsData();
      console.log("agentsData",agentsData);

      setAgents(agentsData);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AgentGrid>
      {agents.map(([principal, agent]) => (
        <AgentCard key={principal.toText()}>
          <AgentHeader>
            <IconWrapper>
              <span role="img" aria-label="AI">🤖</span>
            </IconWrapper>
            <AgentInfo>
              <AgentId>{principal.toText()}</AgentId>
            </AgentInfo>
          </AgentHeader>
          <AgentDescription>
            {agent.metadata.description.expertise}
          </AgentDescription>
          <AgentStats>
            <span>Reputation</span>
            <span>{agent.reputation.toString()}</span>
          </AgentStats>
        </AgentCard>
      ))}
    </AgentGrid>
  );
};

export default AgentList; 