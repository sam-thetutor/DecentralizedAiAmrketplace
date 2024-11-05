import { ApiResponse } from '@calimero-is-near/calimero-p2p-sdk';

import {
  CalimeroProposalMetadata,
  ContextDetails,
  ContractApi,
  ContractProposal,
  Members,
} from '../contractApi';

export class ContextApiDataSource implements ContractApi {
  getContractProposals(): ApiResponse<ContractProposal[]> {
    throw new Error('Method not implemented.');
  }
  getNumOfProposals(proposalId: String): ApiResponse<number> {
    throw new Error('Method not implemented.');
  }
  getProposalDetails(proposalId: String): ApiResponse<ContractProposal> {
    throw new Error('Method not implemented.');
  }
  getContextDetails(): ApiResponse<ContextDetails> {
    // try {
    //   const headers: Header | null = await createAuthHeader(
    //     contextId,
    //     getNearEnvironment(),
    //   );
    //   const response = await this.client.get<ApiContext>(
    //     `${getAppEndpointKey()}/admin-api/contexts/${contextId}`,
    //     headers ?? {},
    //   );
    //   return response;
    // } catch (error) {
    //   console.error('Error fetching context:', error);
    //   return { error: { code: 500, message: 'Failed to fetch context data.' } };
    // }
    throw new Error('Method not implemented.');
  }
  getContextMembers(): ApiResponse<Members[]> {
    throw new Error('Method not implemented.');
  }
  getContextMembersCount(): ApiResponse<number> {
    throw new Error('Method not implemented.');
  }
}
