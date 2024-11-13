import {
  clearAppEndpoint,
  clearJWT,
  getAccessToken,
  getAppEndpointKey,
  getRefreshToken,
  ResponseData,
} from '@calimero-is-near/calimero-p2p-sdk';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { LogicApiDataSource } from '../../api/dataSource/LogicApiDataSource';
import {
  ApproveProposalRequest,
  ApproveProposalResponse,
  CreateProposalRequest,
  CreateProposalResponse,
  GetProposalMessagesRequest,
  GetProposalMessagesResponse,
  SendProposalMessageRequest,
} from '../../api/clientApi';
import { getStorageApplicationId } from '../../utils/node';
import {
  clearApplicationId,
  getStorageExecutorPublicKey,
} from '../../utils/storage';
import { useNavigate } from 'react-router-dom';
import { ContextApiDataSource } from '../../api/dataSource/ContractApiDataSource';
import { ContractProposal } from '../../api/contractApi';

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

const Button = styled.div`
  color: white;
  padding: 0.25em 1em;
  margin: 0.25em;
  border-radius: 8px;
  font-size: 2em;
  background: #5dbb63;
  cursor: pointer;
  justify-content: center;
  display: flex;
`;

const ButtonReset = styled.div`
  color: white;
  padding: 0.25em 1em;
  border-radius: 8px;
  font-size: 1em;
  background: #ffa500;
  cursor: pointer;
  justify-content: center;
  display: flex;
  margin-top: 1rem;
`;

const StatusTitle = styled.div`
  color: white;
  justify-content: center;
  display: flex;
`;

const StatusValue = styled.div`
  color: white;
  font-size: 60px;
  justify-content: center;
  display: flex;
`;

const LogoutButton = styled.div`
  color: black;
  margin-top: 2rem;
  padding: 0.25em 1em;
  border-radius: 8px;
  font-size: 1em;
  background: white;
  cursor: pointer;
  justify-content: center;
  display: flex;
`;

export default function HomePage() {
  const navigate = useNavigate();
  const url = getAppEndpointKey();
  const applicationId = getStorageApplicationId();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

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
      author: request.author,
      text: request.text,
    };
    const result: ResponseData<GetProposalMessagesResponse> =
      await new LogicApiDataSource().getProposalMessages(params);
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      return;
    }
  }

  async function createProposal() {
    let request: CreateProposalRequest = {
      receiver: 'vuki.testnet',
    };

    const result: ResponseData<CreateProposalResponse> =
      await new LogicApiDataSource().createProposal(request);
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      return;
    }
  }

  async function getAllProposals() {
    const result: ResponseData<ContractProposal[]> =
      await new ContextApiDataSource().getContractProposals({offset: 0, limit: 10});
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      return;
    } else {
      console.log('Proposals:', result.data);
    }
  }

  async function getProposalDetails() {
    //TODO implement this function
  }

  async function getNumOfProposals() {
    //TODO implement this function
  }

  async function approveProposal() {
    let request: ApproveProposalRequest = {
      proposal_id: '1',
    };

    const result: ResponseData<ApproveProposalResponse> =
      await new LogicApiDataSource().approveProposal(request);
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      return;
    }
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
  //       setCount(currentValueInt);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   observeNodeEvents();
  // }, []);

  const logout = () => {
    clearAppEndpoint();
    clearJWT();
    clearApplicationId();
    navigate('/auth');
  };

  return (
    <FullPageCenter>
      <TextStyle>
        <span> Welcome to home page!</span>
      </TextStyle>

      <text> Proposals </text>

      <Button onClick={createProposal}> Create new proposals</Button>
      <Button onClick={getAllProposals}> Get all proposals</Button>
      <Button onClick={approveProposal}> Approve proposal 1</Button>

      <text> Messages</text>
      <Button
        onClick={() => {
          fetchProposalMessages('1');
        }}
      >
        Get messages from proposal with id "1"
      </Button>
      <Button
        onClick={() => {
          sendProposalMessage({
            proposal_id: '1',
            author: getStorageExecutorPublicKey(),
            text: 'test' + Math.random(),
          } as SendProposalMessageRequest);
        }}
      >
        Send messages to proposal with id "1"
      </Button>

      <LogoutButton onClick={logout}>Logout</LogoutButton>
    </FullPageCenter>
  );
}
