import {
  getAccessToken,
  getAppEndpointKey,
  getRefreshToken,
  NodeEvent,
  ResponseData,
  SubscriptionsClient,
} from '@calimero-is-near/calimero-p2p-sdk';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import {
  getWsSubscriptionsClient,
  LogicApiDataSource,
} from '../../api/dataSource/LogicApiDataSource';
import {
  ApproveProposalRequest,
  ApproveProposalResponse,
  CreateProposalRequest,
  CreateProposalResponse,
  GetProposalMessagesRequest,
  GetProposalMessagesResponse,
  SendProposalMessageRequest,
  SendProposalMessageResponse,
  ProposalActionType,
  ExternalFunctionCallAction,
  TransferAction,
} from '../../api/clientApi';
import { getContextId, getStorageApplicationId } from '../../utils/node';
import {
  getJWTObject,
  getStorageExecutorPublicKey,
} from '../../utils/storage';
import { useNavigate } from 'react-router-dom';
import { ContextApiDataSource } from '../../api/dataSource/ContractApiDataSource';
import {
  ApprovalsCount,
  ContextVariables,
  ContractProposal,
} from '../../api/contractApi';
import { Buffer } from 'buffer';
import bs58 from 'bs58';
import CreateProposalPopup, {
  ProposalData,
} from '../../components/proposals/CreateProposalPopup';
import Actions from '../../components/proposal/Actions';
import Navbar from '../../components/Navbar';
import AgentList from '../../components/agents/AgentList';

const FullPageCenter = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #111111;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const TextStyle = styled.div`
  color: white;
  margin-bottom: 2em;
  font-size: 2em;
`;

const Button = styled.button`
  color: white;
  padding: 0.25em 1em;
  margin: 0.25em;
  border-radius: 8px;
  font-size: 2em;
  background: #5dbb63;
  cursor: pointer;
  justify-content: center;
  display: flex;
  border: none;
  outline: none;
`;

const ButtonSm = styled.button`
  color: white;
  padding: 0.25em 1em;
  margin: 0.25em;
  border-radius: 8px;
  font-size: 1rem;
  background: #5dbb63;
  cursor: pointer;
  justify-content: center;
  display: flex;
  border: none;
  outline: none;
`;

const ProposalsWrapper = styled.div`
  .select-dropdown {
    text-align: center;
    color: white;
    padding: 0.25em 1em;
    margin: 0.25em;
    border-radius: 8px;
    font-size: 1rem;
    background: #5dbb63;
    cursor: pointer;
    justify-content: center;
    display: flex;
    border: none;
    outline: none;
  }

  .proposal-data {
    font-size: 0.75rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .actions-headers {
    display: flex;
    justify-content: space-between;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .flex-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .center {
    justify-content: center;
    margin-top: 0.5rem;
  }

  .title {
    padding: 0;
    margin: 0;
  }

  .actions-title {
    padding-top: 0.5rem;
  }

  .highlight {
    background: #ffa500;
  }
`;

const StyledTable = styled.table`
  th,
  td {
    text-align: center;
    padding: 8px;
    max-width: 200px;
    overflow-wrap: break-word;
  }
`;

const ContextVariablesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .context-variables {
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
  }
`;

export default function HomePage() {
  const navigate = useNavigate();
  const url = getAppEndpointKey();
  const applicationId = getStorageApplicationId();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const [createProposalLoading, setCreateProposalLoading] = useState(false);
  const [proposals, setProposals] = useState<ContractProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ContractProposal>();
  const [selectedProposalApprovals, setSelectedProposalApprovals] = useState<
    null | number
  >(null);
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [approveProposalLoading, setApproveProposalLoading] = useState(false);
  const [hasAlerted, setHasAlerted] = useState<boolean>(false);
  const lastExecutedProposalRef = useRef<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contextVariables, setContextVariables] = useState<ContextVariables[]>(
    [],
  );
  useEffect(() => {
    if (!url || !applicationId || !accessToken || !refreshToken) {
      navigate('/auth');
    }
  }, [accessToken, applicationId, navigate, refreshToken, url]);

  async function fetchProposalMessages(proposalId: String) {
    const params: GetProposalMessagesRequest = {
      proposal_id: proposalId,
    };
    const result: ResponseData<GetProposalMessagesResponse> =
      await new LogicApiDataSource().getProposalMessages(params);
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      return;
    }
  }

  async function sendProposalMessage(request: SendProposalMessageRequest) {
    const params: SendProposalMessageRequest = {
      proposal_id: request.proposal_id,
      message: {
        id: request.message.id,
        proposal_id: request.proposal_id,
        author: request.message.author,
        text: request.message.text,
        created_at: new Date().toISOString(),
      },
    };
    const result: ResponseData<SendProposalMessageResponse> =
      await new LogicApiDataSource().sendProposalMessage(params);
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      return;
    }
  }

  async function createProposal(formData: ProposalData) {
    setCreateProposalLoading(true);
    let request: CreateProposalRequest;

    try {
      console.log('Action type:', formData.actionType);

      switch (formData.actionType) {
        case 'Cross contract call': {
          const argsObject = formData.arguments.reduce(
            (acc, curr) => {
              if (curr.key && curr.value) {
                acc[curr.key] = curr.value;
              }
              return acc;
            },
            {} as Record<string, any>,
          );

          console.log(
            'Creating ExternalFunctionCall proposal with args:',
            argsObject,
          );

          request = {
            action_type: ProposalActionType.ExternalFunctionCall,
            params: {
              receiver_id: formData.contractId,
              method_name: formData.methodName,
              args: JSON.stringify(argsObject),
              deposit: formData.deposit || '0',
            },
          };

          console.log(
            'Final request structure:',
            JSON.stringify(request, null, 2),
          );
          break;
        }

        case 'Transfer': {
          request = {
            action_type: ProposalActionType.Transfer,
            params: {
              receiver_id: formData.receiverId,
              amount: formData.amount,
            },
          };
          break;
        }

        case 'Set context variable': {
          request = {
            action_type: ProposalActionType.SetContextValue,
            params: {
              key: formData.contextVariables[0].key,
              value: formData.contextVariables[0].value,
            },
          };
          break;
        }

        case 'Change number of approvals needed': {
          request = {
            action_type: ProposalActionType.SetNumApprovals,
            params: {
              num_approvals: Number(formData.minApprovals),
            },
          };
          break;
        }

        case 'Change number of maximum active proposals': {
          request = {
            action_type: ProposalActionType.SetActiveProposalsLimit,
            params: {
              active_proposals_limit: Number(formData.maxActiveProposals),
            },
          };
          break;
        }

        default:
          throw new Error('Invalid action type');
      }

      console.log('Request:', request);

      const result: ResponseData<CreateProposalResponse> =
        await new LogicApiDataSource().createProposal(request);

      if (result?.error) {
        console.error('Error:', result.error);
        window.alert(`${result.error.message}`);
        return;
      }

      if (result?.data) {
        window.alert(`Proposal created successfully`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      window.alert(`Error creating proposal: ${error.message}`);
    } finally {
      setCreateProposalLoading(false);
    }
  }

  const getProposals = async () => {
    const result: ResponseData<ContractProposal[]> =
      await new ContextApiDataSource().getContractProposals({
        offset: 0,
        limit: 10,
      });
    if (result?.error) {
      console.error('Error:', result.error);
      setProposals([]);
    } else {
      // @ts-ignore - we know the data structure has a nested data property
      const proposalsData = result.data?.data || [];

      if (selectedProposal && proposals.length > 0) {
        const stillExists = proposalsData.some(
          (proposal: any) => proposal.id === selectedProposal.id,
        );

        if (
          !stillExists &&
          lastExecutedProposalRef.current !== selectedProposal.id
        ) {
          window.alert(`Proposal with id: ${selectedProposal.id} was executed`);
          lastExecutedProposalRef.current = selectedProposal.id;
          setSelectedProposal(undefined);
        }
      }

      setProposals(proposalsData);
    }
  };

  useEffect(() => {
    if (selectedProposal) {
      lastExecutedProposalRef.current = null;
    }
  }, [selectedProposal]);

  const [approvers, setApprovers] = useState<string[]>([]);

  const getApprovers = async () => {
    if (selectedProposal) {
      const result = await new ContextApiDataSource().getProposalApprovals(
        selectedProposal.id,
      );
      // @ts-ignore
      setApprovers(result?.data.data ?? []);
    }
  };

  const getProposalApprovals = async () => {
    if (selectedProposal) {
      const result: ResponseData<ApprovalsCount> =
        await new ContextApiDataSource().getProposalApprovals(
          selectedProposal?.id,
        );
      if (result?.error) {
        console.error('Error:', result.error);
      } else {
        // @ts-ignore
        setSelectedProposalApprovals(result.data.data.num_approvals);
      }
    }
  };

  async function getNumOfProposals() {
    const result: ResponseData<number> =
      await new ContextApiDataSource().getNumOfProposals();
    if (result?.error) {
      console.error('Error:', result.error);
    } else {
      // @ts-ignore
      setProposalCount(result.data);
    }
  }

  async function getContextVariables() {
    const result: ResponseData<ContextVariables[]> =
      await new ContextApiDataSource().getContextVariables();
    if (result?.error) {
      console.error('Error:', result.error);
    } else {
      // @ts-ignore
      setContextVariables(result.data);
    }
  }

  useEffect(() => {
    const setProposalData = async () => {
      await getProposalApprovals();
      await getProposals();
      await getNumOfProposals();
      await getApprovers();
    };
    setProposalData();
    const intervalId = setInterval(setProposalData, 5000);
    return () => clearInterval(intervalId);
  }, [selectedProposal]);

  async function approveProposal(proposalId: string) {
    setApproveProposalLoading(true);
    let request: ApproveProposalRequest = {
      proposal_id: proposalId,
    };

    const result: ResponseData<ApproveProposalResponse> =
      await new LogicApiDataSource().approveProposal(request);
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      setApproveProposalLoading(false);
      return;
    }
    setApproveProposalLoading(false);
    window.alert(`Proposal approved successfully`);
  }

  async function getContextDetails() {
    //TODO implement this function
  }

  async function getContextMembers() {
    //TODO implement this function
  }

  async function getContextMembersCount() {
    //TODO implement this function
  }

  // const observeNodeEvents = async () => {
  //   let subscriptionsClient: SubscriptionsClient = getWsSubscriptionsClient();
  //   await subscriptionsClient.connect();
  //   subscriptionsClient.subscribe([getContextId()]);

  //   subscriptionsClient?.addCallback((data: NodeEvent) => {
  //     if (data.data.events && data.data.events.length > 0) {
  //       let currentValue = String.fromCharCode(...data.data.events[0].data);
  //       let currentValueInt = isNaN(parseInt(currentValue))
  //         ? 0
  //         : parseInt(currentValue);
  //       console.log('currentValueInt', currentValueInt);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   observeNodeEvents();
  // }, []);

  const deleteProposal = async (proposalId: string) => {
    try {
      // Decode the base58 proposal ID to bytes
      const bytes = bs58.decode(proposalId);
      // Convert to hex string
      const proposalIdHex = Buffer.from(bytes).toString('hex');

      const request: CreateProposalRequest = {
        action_type: ProposalActionType.DeleteProposal,
        params: {
          proposal_id: proposalIdHex,
        },
      };
      const result: ResponseData<CreateProposalResponse> =
        await new LogicApiDataSource().createProposal(request);

      if (result?.error) {
        console.error('Error:', result.error);
        window.alert(`${result.error.message}`);
        return;
      }

      if (result?.data) {
        window.alert(`Delete proposal created successfully`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error deleting proposal:', error);
      window.alert(`Error deleting proposal: ${error.message}`);
    }
  };

  // Add this helper function to check if current user is the author
  const isCurrentUserAuthor = (proposal: ContractProposal): boolean => {
    const currentUserKey = getJWTObject()?.executor_public_key;
    return proposal.author_id === currentUserKey;
  };

  return (
    <>
      <Navbar />
      <FullPageCenter>
        <TextStyle>
          <span>Available Agents</span>
        </TextStyle>
        <AgentList />
      </FullPageCenter>
    </>
  );
}
