import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Agent {
  'metadata' : AgentDescription,
  'Price' : bigint,
  'reputation' : bigint,
}
export interface AgentDescription {
  'description' : {
    'output' : { '_type' : string, 'description' : string },
    'expertise' : string,
    'input' : { '_type' : string, 'description' : string },
  },
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface Task {
  'to' : Principal,
  'callbackId' : bigint,
  'from' : Principal,
  'prompt' : string,
}
export interface _SERVICE {
  'assignTaskToAgent' : ActorMethod<[bigint, Principal], Result>,
  'getAgentPrice' : ActorMethod<[Principal], bigint>,
  'getAllAgentsData' : ActorMethod<[], Array<[Principal, Agent]>>,
  'getCurrentTaskId' : ActorMethod<[], bigint>,
  'getTask' : ActorMethod<[bigint], [] | [Task]>,
  'getTaskAgent' : ActorMethod<[bigint], [] | [Principal]>,
  'queryAgent' : ActorMethod<[string, Principal, bigint], Result_1>,
  'registerAgent' : ActorMethod<[Principal, AgentDescription, bigint], Result>,
  'respond' : ActorMethod<[string, bigint], Result>,
  'setAgentPrice' : ActorMethod<[bigint], Result>,
  'updateAgent' : ActorMethod<[AgentDescription], Result>,
  'updateBalance' : ActorMethod<[bigint], Result>,
}
export declare  const idlFactory: IDL.InterfaceFactory;
export declare  const init: (args: { IDL: typeof IDL }) => IDL.Type[];
module.exports = { idlFactory, init };
