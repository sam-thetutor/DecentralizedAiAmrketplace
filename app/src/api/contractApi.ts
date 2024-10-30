import { ApiResponse } from '@calimero-is-near/calimero-p2p-sdk';

export interface ContractProposal {}

//
export interface CalimeroProposalMetadata {}

export interface ContextDetails {}

export interface Members {
  publicKey: String;
}

export interface Message {
  publicKey: String;
}

export interface ContractApi {
  //Contract
  getContractProposals(): ApiResponse<ContractProposal[]>;
  getContractProposalMetadata(
    proposalId: String,
  ): ApiResponse<CalimeroProposalMetadata>;
  getNumOfProposals(proposalId: String): ApiResponse<number>;
  getProposalDetails(proposalId: String): ApiResponse<ContractProposal>;
  voteForProposal(proposalId: String): ApiResponse<boolean>;
  getContextDetails(): ApiResponse<ContextDetails>;
  getContextMembers(): ApiResponse<Members[]>;
  getContextMembersCount(): ApiResponse<number>;
}
