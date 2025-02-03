import { useState, useEffect } from 'react';
import { FiCpu } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { createActor } from '../utils/createActor';
import { HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../utils/backend.did';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  let agentStoreId = "skndj-viaaa-aaaah-qp5oq-cai";

  const fetchAgents = async () => {
    try {
      const agent = HttpAgent.createSync({
        host: "https://ic0.app",
      });

      if (process.env.NODE_ENV !== "production") {
        await agent.fetchRootKey();
      }

      const agentStore = createActor(agentStoreId, idlFactory, agent);
      const agentsData = await agentStore.getAllAgentsData();
      setAgents(agentsData);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAgents();

    // Set up polling every 10 seconds
    const interval = setInterval(fetchAgents, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI Agent Network</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover our network of specialized AI agents ready to assist you
          </p>
        </div>

        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
            {agents.map(([principal, agent]) => (
              <div
                key={principal.toText()}
                className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg shrink-0">
                    <FiCpu className="text-blue-500 text-2xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-2">Canister ID</p>
                    <p className="text-white text-sm font-mono break-all">
                      {principal.toText()}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                  <p className="text-white mb-4">
                    {agent.metadata.description.expertise}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-sm text-gray-400">Reputation</span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                    {agent.reputation.toString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentList; 