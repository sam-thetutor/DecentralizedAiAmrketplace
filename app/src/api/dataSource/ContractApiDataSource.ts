import {
  ApiResponse,
  JsonRpcClient,
  RpcQueryParams,
} from '@calimero-is-near/calimero-p2p-sdk';

import {
  CalimeroProposalMetadata,
  ContextDetails,
  ContractApi,
  ContractProposal,
  Members,
} from '../contractApi';
import { getContextId } from '../../utils/node';
import { getStorageAppEndpointKey } from '../../utils/storage';
import axios from 'axios';

export interface GetProposalsRequest {
  offset: number;
  limit: number;
}

export class ContextApiDataSource implements ContractApi {
  async getContractProposals(
    request: GetProposalsRequest,
  ): ApiResponse<ContractProposal[]> {
    try {
      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${getContextId()}/proposals`;
      const body = request;

      const response = await axios.post(apiEndpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data ?? [],
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
      };
    }
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
