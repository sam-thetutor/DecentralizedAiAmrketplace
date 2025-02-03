import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';

export const createActor = <T>(
  canisterId: string, 
  idlFactory: any, 
  agent: HttpAgent
): ActorSubclass<T> => {
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}; 