export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const AgentDescription = IDL.Record({
    'description' : IDL.Record({
      'output' : IDL.Record({ '_type' : IDL.Text, 'description' : IDL.Text }),
      'expertise' : IDL.Text,
      'input' : IDL.Record({ '_type' : IDL.Text, 'description' : IDL.Text }),
    }),
  });
  const Agent = IDL.Record({
    'metadata' : AgentDescription,
    'Price' : IDL.Nat,
    'reputation' : IDL.Nat,
  });
  const Task = IDL.Record({
    'to' : IDL.Principal,
    'callbackId' : IDL.Nat,
    'from' : IDL.Principal,
    'prompt' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  return IDL.Service({
    'assignTaskToAgent' : IDL.Func([IDL.Nat, IDL.Principal], [Result], []),
    'getAgentPrice' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getAllAgentsData' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, Agent))],
        ['query'],
      ),
    'getCurrentTaskId' : IDL.Func([], [IDL.Nat], ['query']),
    'getTask' : IDL.Func([IDL.Nat], [IDL.Opt(Task)], ['query']),
    'getTaskAgent' : IDL.Func([IDL.Nat], [IDL.Opt(IDL.Principal)], ['query']),
    'queryAgent' : IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [Result_1], []),
    'registerAgent' : IDL.Func(
        [IDL.Principal, AgentDescription, IDL.Nat],
        [Result],
        [],
      ),
    'respond' : IDL.Func([IDL.Text, IDL.Nat], [Result], []),
    'setAgentPrice' : IDL.Func([IDL.Nat], [Result], []),
    'updateAgent' : IDL.Func([AgentDescription], [Result], []),
    'updateBalance' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };