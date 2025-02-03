import { ethers } from 'ethers';
import { HfInference } from '@huggingface/inference';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';
import { runInference } from '../utils/utils.js';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import { createActor } from './utils/createActor.js';
import { HttpAgent } from '@dfinity/agent';
import { idlFactory } from './utils/backend.did.js';
import { Principal } from '@dfinity/principal';
import { adminIdentity } from '../utils/admin.js';

dotenv.config({ path: '../../.env' }); 
let agentStoreId="skndj-viaaa-aaaah-qp5oq-cai";

const agent = new HttpAgent({
    host: 'https://ic.ic0.app'
});
agent.fetchRootKey()

const authenticatedAgent = new HttpAgent({
    host: 'https://ic.ic0.app',
    identity: adminIdentity
});

console.log("adming identity :",adminIdentity.getPrincipal().toText())

const agentStore = createActor(agentStoreId, idlFactory, agent);
const authenticatedAgentStore = createActor(agentStoreId, idlFactory, authenticatedAgent);

const POLL_INTERVAL = 5000; // Poll every 5 seconds
let lastKnownTaskId = 0;
let lastKnownResponseCount = 0;
let agentsCache = [];

// Save history for each query for specific task id
const callbacksState = {};
let lastCallbackId = 0;
const callbackToTask = {};

async function pollAgentStore() {
    try {
        // Fetch all agents and their metadata
        const data = await agentStore.getAllAgentsData();
        
        let addresses = [];
        let agents = [];
        
        // Sort the data into addresses and agents
        for (let i = 0; i < data.length; i++) {
            addresses.push(data[i][0]);
            agents.push(data[i][1]);
        }
        // Extract descriptions
        const descriptions = agents.map(agent => agent.metadata.description);

        // Format descriptions for prompt
        const modelDescriptionsText = descriptions.map((desc, index) => 
            `${index + 1}. ${desc.expertise}`
        ).join("\n");

        // Create lookup maps
        const modelDescriptions = descriptions.map((desc, index) => ({ 
            [index + 1]: desc 
        }));
        
        const agentAddresses = addresses.reduce((acc, addr, index) => {
            acc[index + 1] = addr;
            return acc;
        }, {});


        console.log("agentAddresses :",agentAddresses,"modelDescriptions :",modelDescriptions,"modelDescriptionsText :",modelDescriptionsText);
        // Get current task count and check for new tasks
        const currentTaskId = await agentStore.getCurrentTaskId();
        console.log("currentTaskId :",currentTaskId);
        
        if (currentTaskId > lastKnownTaskId) {
            console.log(`New tasks detected: ${lastKnownTaskId} -> ${currentTaskId}`);
            
            // Process each new task
            for (let taskId = lastKnownTaskId; taskId < currentTaskId; taskId++) {
                const task = await agentStore.getTask(taskId);
                if (task) {
                    console.log("task :",task);
                    await processTask(
                        task[0].prompt, 
                        taskId,
                        modelDescriptionsText, 
                        modelDescriptions, 
                        agentAddresses, 
                        agents.length
                    );
                }
            }
            
            lastKnownTaskId = currentTaskId;
        }

    } catch (error) {
        console.error("Error polling agent store:", error);
    }
}

async function processTask(task,taskId, modelDescriptionsText, modelDescriptions, agentAddresses, modelCount) {
    try {
        const systemPrompt = "You MUST respond with number. The number MUST be in range from 1 to " + modelCount + ". The number represents the description of the agent that best suits the query.";

        const routerPromptToGetId = "Which description out of these best describes the nature of this query? The query: " + task + 
        "\nThe description with their ordinal number are: " + modelDescriptionsText + 
        "\n Your answer MUST be just one number in range from 1 to " + modelCount + ". ";

        const response = await runInference(routerPromptToGetId, 3);
        const number = response.match(/\d+/)[0];
        const responseInt = parseInt(number);

        if (isNaN(responseInt) || responseInt < 1 || responseInt > modelCount) {
            throw new Error("Invalid agent selection");
        }

        const selectedAgent = agentAddresses[responseInt];

        // Store the task-agent mapping in the agentStore
        const agent = HttpAgent.createSync({
            host: "https://ic0.app",
        });

        
        await authenticatedAgentStore.assignTaskToAgent(taskId, selectedAgent);
        console.log("assigned")
        console.log(`Task ${taskId} assigned to agent ${selectedAgent.toText()}`);

        // Store callback mapping
        const newCallbackId = lastCallbackId++;
        callbacksState[newCallbackId] = task;
        callbackToTask[newCallbackId] = 11;

        // Query the selected agent
        // await agentStore.queryAgent(formattedPrompt, selectedAgent, newCallbackId);
        console.log(`Task routed to agent ${selectedAgent.toText()}`);

    } catch (error) {
        console.error("Error processing task:", error);
    }
}

// Start periodic polling
function startPolling() {
    pollAgentStore();
    setInterval(pollAgentStore, POLL_INTERVAL);
}

async function main() {
    try {
        lastKnownTaskId = await agentStore.getCurrentTaskId();
        startPolling();
    } catch (error) {
        console.error("Error in main:", error);
    }
}

main().catch(console.error);