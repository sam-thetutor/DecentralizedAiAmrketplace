import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/Navbar';
import { ContractProposal } from '../../api/contractApi';
import { ContextApiDataSource } from '../../api/dataSource/ContractApiDataSource';
import { getJWTObject } from '../../utils/storage';
import Actions from '../../components/proposal/Actions';
import { LogicApiDataSource } from '../../api/dataSource/LogicApiDataSource';
import { Buffer } from 'buffer';
import bs58 from 'bs58';
import {
  ApproveProposalRequest,
  ApproveProposalResponse,
  CreateProposalRequest,
  CreateProposalResponse,
  ProposalActionType,
} from '../../api/clientApi';
import type { ResponseData } from '@calimero-is-near/calimero-p2p-sdk';
import CreateProposalPopup, { ProposalData } from '../../components/proposals/CreateProposalPopup';

const ProposalsWrapper = styled.div`
  padding-top: 5rem;
  min-height: 100vh;
  background-color: #111111;
  color: white;
`;

const ProposalsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProposalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProposalCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ProposalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProposalId = styled.span`
  font-family: monospace;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;

const AuthorId = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  word-break: break-all;
`;

const ActionsList = styled.div`
  margin: 1rem 0;
`;

const VoteButton = styled.button<{ approved?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background: ${props => props.approved ? '#4a9550' : '#5dbb63'};
  color: white;
  cursor: ${props => props.approved ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.approved ? 0.7 : 1};
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.approved ? '#4a9550' : '#4a9550'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const CreateButton = styled.button`
  background-color: #5dbb63;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-bottom: 2rem;
  font-size: 1rem;
  
  &:hover {
    background-color: #4a9550;
  }
`;

const VoteCount = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
`;

interface VoteCounts {
  [proposalId: string]: {
    approvals: string[];
    total: number;
  };
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<ContractProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({});
  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set());

  const fetchProposals = async () => {
    try {
      const result = await new ContextApiDataSource().getContractProposals({
        offset: 0,
        limit: 100,
      });
      console.log('Full API Response:', result);
      console.log('Proposals data:', result.data?.data);

      if (result.data?.data) {
        setProposals(Array.isArray(result.data.data) ? result.data.data : []);
      } else {
        setProposals([]);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: string) => {
    try {
      const result = await new ContextApiDataSource().approveProposal(
      proposalId,
      );
      console.log('Vote result:', result);
      if (result.data) {
        setVotedProposals(prev => new Set([...prev, proposalId]));
        await fetchVoteCounts(proposalId);
        await fetchProposals();
      }
    } catch (error) {
      console.error('Error voting on proposal:', error);
    }
  };


  async function approveProposal(proposalId: string) {
    // setApproveProposalLoading(true);
    let request: ApproveProposalRequest = {
      proposal_id: proposalId,
    };

    const result: ResponseData<ApproveProposalResponse> =
      await new LogicApiDataSource().approveProposal(request);
    if (result?.error) {
      console.error('Error:', result.error);
      window.alert(`${result.error.message}`);
      // setApproveProposalLoading(false);
      return;
    }
    // setApproveProposalLoading(false);
    window.alert(`Proposal approved successfully`);
  }



  const deleteProposal = async (proposalId: string) => {
    try {
      const bytes = bs58.decode(proposalId);
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
        await fetchProposals();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error deleting proposal:', error);
      window.alert(`Error deleting proposal: ${error.message}`);
    }
  };

  const isCurrentUserAuthor = (proposal: ContractProposal): boolean => {
    const currentUserKey = getJWTObject()?.executor_public_key;
    return proposal.author_id === currentUserKey;
  };

  const createProposal = async (proposalForm: ProposalData) => {
    try {
      let actionType: ProposalActionType;
      let params: any = {};

      console.log('Creating proposal with form data:', proposalForm);

      switch (proposalForm.actionType) {
        case 'Cross contract call':
          actionType = ProposalActionType.ExternalFunctionCall;
          params = {
            contract_id: proposalForm.contractId,
            method_name: proposalForm.methodName,
            args: proposalForm.arguments,
            deposit: proposalForm.deposit,
            description: proposalForm.description,
            amount: proposalForm.amount,
            expertise: proposalForm.expertise,
          };
          break;
        case 'Transfer':
          actionType = ProposalActionType.Transfer;
          params = {
            receiver_id: proposalForm.receiverId,
            amount: proposalForm.amount,
          };
          break;
        case 'Change number of approvals needed':
          actionType = ProposalActionType.SetNumApprovals;
          params = {
            num_approvals: parseInt(proposalForm.minApprovals),
          };
          break;
        default:
          throw new Error('Unsupported action type');
      }

      const request: CreateProposalRequest = {
        action_type: actionType,
        params,
      };

      console.log('Sending proposal request:', request);
      const result = await new LogicApiDataSource().createProposal(request);
      console.log('Create proposal response:', result);

      if (result?.error) {
        console.error('Error:', result.error);
        window.alert(`${result.error.message}`);
        return;
      }

      if (result?.data) {
        window.alert('Proposal created successfully');
        await fetchProposals();
      }
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      window.alert(`Error creating proposal: ${error.message}`);
    }
  };

  const fetchVoteCounts = async (proposalId: string) => {
    try {
      const result = await new ContextApiDataSource().getProposalApprovals(proposalId);
      console.log("proposal approvals:", result.data);
      if (result.data) {
        setVoteCounts(prev => ({
          ...prev,
          [proposalId]: {
            approvals: result?.data?.data || [],
            total: result.data.data?.length || 0
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching vote counts:', error);
    }
  };

  const getProposalApprovals = async (proposalId: string) => {
 
      const result: ResponseData<ApprovalsCount> =
        await new ContextApiDataSource().getProposalApprovals(
          proposalId,
        );
      if (result?.error) {
        console.error('Error:', result.error);
      } else {
        // @ts-ignore
        console.log("proposal approvals", result.data.data.num_approvals);
      }
    
  };

  useEffect(() => {
    fetchProposals();
    const interval = setInterval(fetchProposals, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    proposals.forEach(proposal => {
      fetchVoteCounts(proposal.id);
    });
  }, [proposals]);

  if (loading) {
    return (
      <>
        <Navbar />
        <ProposalsWrapper>
          <ProposalsContent>Loading...</ProposalsContent>
        </ProposalsWrapper>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ProposalsWrapper>
        <ProposalsContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Active Proposals</h1>
            <CreateButton onClick={() => setShowCreatePopup(true)}>
              Create Proposal
            </CreateButton>
          </div>
          <ProposalGrid>
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id}>
                <ProposalHeader>
                  <ProposalId>ID: {proposal.id}</ProposalId>
                </ProposalHeader>
                <AuthorId>Author: {proposal.author_id}</AuthorId>
                <ActionsList>
                  <h3>Actions</h3>
                  <Actions actions={proposal.actions} />
                </ActionsList>
                <VoteCount>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                    <span>Approvals ({voteCounts[proposal.id]?.approvals.length || 0}):</span>
                    {voteCounts[proposal.id]?.approvals.map((approverId, index) => (
                      <span key={index} style={{ 
                        fontSize: '0.75rem', 
                        color: 'rgba(255,255,255,0.6)',
                        wordBreak: 'break-all',
                        paddingLeft: '0.5rem'
                      }}>
                        {approverId}
                      </span>
                    ))}
                  </div>
                </VoteCount>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {!isCurrentUserAuthor(proposal) && (
                    <VoteButton 
                      onClick={() => approveProposal(proposal.id)}
                      disabled={votedProposals.has(proposal.id)}
                      approved={votedProposals.has(proposal.id)}
                    >
                      {votedProposals.has(proposal.id) ? 'Voted' : 'Vote to Approve'}
                    </VoteButton>
                  )}
                  {isCurrentUserAuthor(proposal) && (
                    <VoteButton 
                      onClick={() => deleteProposal(proposal.id)}
                      style={{ backgroundColor: '#ff4444' }}
                    >
                      Delete Proposal
                    </VoteButton>
                  )}
                </div>
              </ProposalCard>
            ))}
          </ProposalGrid>
        </ProposalsContent>
      </ProposalsWrapper>
      {showCreatePopup && (
        <CreateProposalPopup
          onClose={() => {
            setShowCreatePopup(false);
            fetchProposals();
          }}
          onSuccess={async (proposalForm) => {
            await createProposal(proposalForm);
            await fetchProposals();
            setShowCreatePopup(false);
          }}
        />
      )}
    </>
  );
} 