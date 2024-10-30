import { ApiResponse } from '@calimero-is-near/calimero-p2p-sdk';

import {
  CalimeroProposalMetadata,
  ContextDetails,
  ContractApi,
  ContractProposal,
  Members,
} from '../contractApi';

export class ContractApiDataSource implements ContractApi {
  getContractProposals(): ApiResponse<ContractProposal[]> {
    throw new Error('Method not implemented.');
  }
  getContractProposalMetadata(
    proposalId: String,
  ): ApiResponse<CalimeroProposalMetadata> {
    throw new Error('Method not implemented.');
  }
  getNumOfProposals(proposalId: String): ApiResponse<number> {
    throw new Error('Method not implemented.');
  }
  getProposalDetails(proposalId: String): ApiResponse<ContractProposal> {
    throw new Error('Method not implemented.');
  }
  voteForProposal(proposalId: String): ApiResponse<boolean> {
    throw new Error('Method not implemented.');
  }
  getContextDetails(): ApiResponse<ContextDetails> {
    throw new Error('Method not implemented.');
  }
  getContextMembers(): ApiResponse<Members[]> {
    throw new Error('Method not implemented.');
  }
  getContextMembersCount(): ApiResponse<number> {
    throw new Error('Method not implemented.');
  }
}
