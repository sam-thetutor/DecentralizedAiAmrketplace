import { ApiResponse } from '@calimero-is-near/calimero-p2p-sdk';
import { GetProposalsRequest } from './dataSource/ContractApiDataSource';

export interface ContextDetails {}

export interface Members {
  publicKey: String;
}

export interface ProposalAction {
  scope: string;
  params: {
    amount: number;
    receiver_id: string;
  };
}

export interface ContractProposal {
  id: string;
  author_id: string;
  actions: {
    action_type: string;
    params: any;
  }[];
  // Add any other fields that come from the API
}

//
export interface CalimeroProposalMetadata {}

export interface ContextDetails {}

export interface Members {
  publicKey: String;
}

export interface Message {
  publicKey: String;
}

export interface ApprovalsCount {
  proposal_id: string;
  num_approvals: number;
}

export interface ContextVariables {
  key: string;
  value: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface ContractApi {
  //Contract
  getContractProposals(
    request: GetProposalsRequest,
  ): ApiResponse<ContractProposal[]>;
  getNumOfProposals(): ApiResponse<number>;
  getProposalApprovals(proposalId: String): ApiResponse<ApprovalsCount>;
  getContextDetails(contextId: String): ApiResponse<ContextDetails>;
  getContextMembers(): ApiResponse<Members[]>;
  getContextMembersCount(): ApiResponse<number>;
  deleteProposal(proposalId: string): ApiResponse<void>;
  approveProposal(proposalId: string): ApiResponse<void>;
}




