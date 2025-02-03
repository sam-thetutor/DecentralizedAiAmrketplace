import { Actor } from '@dfinity/agent';
import { idlFactory } from './backend.did.js';
export const createActor = (canisterId, idlFactory, agent) => {
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}; 