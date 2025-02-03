import { ApiResponse } from '@calimero-is-near/calimero-p2p-sdk';

import {
  ApprovalsCount,
  ContextDetails,
  ContextVariables,
  ContractApi,
  ContractProposal,
  Members,
} from '../contractApi';
import { getJWTObject, getStorageAppEndpointKey } from '../../utils/storage';
import axios from 'axios';
import { getConfigAndJwt } from './LogicApiDataSource';
import bs58 from 'bs58';

export interface GetProposalsRequest {
  offset: number;
  limit: number;
}

export class ContextApiDataSource implements ContractApi {
  async getContractProposals(
    request: GetProposalsRequest,
  ): ApiResponse<ContractProposal[]> {
    try {
      const token = getJWTObject();
      if (!token) {
        return { 
          error: new Error('No JWT token found'),
          data: null 
        };
      }

      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${token.context_id}/proposals`;
      
      const response = await axios.post(apiEndpoint, request, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      return {
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Fetch Proposals Error:', error);
      return {
        data: null,
        error: error as Error
      };
    }
  }

  async getProposalApprovals(proposalId: String): ApiResponse<ApprovalsCount> {
    try {
      const { jwtObject, error } = getConfigAndJwt();
      if (error) {
        return { error };
      }
      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals/${proposalId}/approvals/users`;

      const response = await axios.get(apiEndpoint);

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

  async getNumOfProposals(): ApiResponse<number> {
    try {
      const { jwtObject, error } = getConfigAndJwt();
      if (error) {
        return { error };
      }

      const apiEndpointLimit = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals/count`;
      const limitResponse = await axios.get(apiEndpointLimit);

      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals`;
      const body = {
        offset: 0,
        limit: limitResponse.data.data,
      };

      const response = await axios.post(apiEndpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data.data.length ?? 0,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
      };
    }
  }

  async getContextVariables(): ApiResponse<ContextVariables[]> {
    try {
      const { jwtObject, error } = getConfigAndJwt();
      if (error) {
        return { error };
      }

      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals/context-storage-entries`;
      const body = {
        offset: 0,
        limit: 10,
      };

      const response = await axios.post(apiEndpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data.data) {
        return {
          data: [],
          error: null,
        };
      }

      // Convert both key and value from Vec<u8> to string
      const parsedData = response.data.data.map((item: any) => ({
        key: new TextDecoder().decode(new Uint8Array(item.key)),
        value: new TextDecoder().decode(new Uint8Array(item.value)),
      }));

      return {
        data: parsedData ?? [],
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
      };
    }
  }

  getContextMembers(): ApiResponse<Members[]> {
    throw new Error('Method not implemented.');
  }
  getContextMembersCount(): ApiResponse<number> {
    throw new Error('Method not implemented.');
  }

  async approveProposal(proposalId: string): ApiResponse<void> {
    try {
      const { jwtObject, error } = getConfigAndJwt();
      if (error) {
        return { error };
      }

      // Convert proposalId from base58 to hex format
      const bytes = bs58.decode(proposalId);
      const proposalIdHex = Buffer.from(bytes).toString('hex');
      console.log("jwtObject", jwtObject, proposalIdHex);

      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals/${proposalIdHex}`;
      console.log("apiEndpoint to approve proposal :", apiEndpoint);
      await axios.post(apiEndpoint, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtObject.context_id}`
        }
      });

      return {
        data: undefined,
        error: null
      };
    } catch (error) {
      console.error('Vote Error:', error);
      return {
        data: null,
        error: error as Error
      };
    }
  }

  async getContextDetails(contextId: string): ApiResponse<ContextDetails> {
    throw new Error('Method not implemented.');
  }



//delete proposal

  async deleteProposal(proposalId: string): ApiResponse<void> {
    try {
      const { jwtObject, error } = getConfigAndJwt();
      const token = getJWTObject();
      if (error) return { error };
      
      const apiEndpoint = `${getStorageAppEndpointKey()}/admin-api/contexts/${jwtObject.context_id}/proposals/${proposalId}`;
      
      console.log("apiEndpoint to delete proposal :", apiEndpoint);
      await axios.delete(apiEndpoint, {
        headers: {
          // 'Authorization': `Bearer ${token}`
        }
      });
      return { data: undefined, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}
