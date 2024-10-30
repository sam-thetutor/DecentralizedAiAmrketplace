import {
  ApiResponse,
  JsonRpcClient,
  RequestConfig,
  WsSubscriptionsClient,
  RpcError,
  handleRpcError,
} from '@calimero-is-near/calimero-p2p-sdk';
import {
  ClientApi,
  ClientMethod,
  GetProposalMessagesRequest,
  GetProposalMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '../clientApi';
import { getContextId, getNodeUrl } from '../../utils/node';
import {
  getJWTObject,
  getStorageAppEndpointKey,
  JsonWebToken,
} from '../../utils/storage';
import { AxiosHeader, createJwtHeader } from '../../utils/jwtHeaders';
import { getRpcPath } from '../../utils/env';

export function getJsonRpcClient() {
  return new JsonRpcClient(getStorageAppEndpointKey() ?? '', getRpcPath());
}

export function getWsSubscriptionsClient() {
  return new WsSubscriptionsClient(getStorageAppEndpointKey() ?? '', '/ws');
}

function getConfigAndJwt() {
  const jwtObject: JsonWebToken | null = getJWTObject();
  const headers: AxiosHeader | null = createJwtHeader();
  if (!headers) {
    return {
      error: { message: 'Failed to create auth headers', code: 500 },
    };
  }
  if (!jwtObject) {
    return {
      error: { message: 'Failed to get JWT token', code: 500 },
    };
  }
  if (jwtObject.executor_public_key === null) {
    return {
      error: { message: 'Failed to get executor public key', code: 500 },
    };
  }

  const config: RequestConfig = {
    headers: headers,
    timeout: 10000,
  };

  return { jwtObject, config };
}

export class ClientApiDataSource implements ClientApi {
  async getProposalMessages(
    proposalsRequest: GetProposalMessagesRequest,
  ): ApiResponse<GetProposalMessagesResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    const response = await getJsonRpcClient().mutate<
      GetProposalMessagesRequest,
      GetProposalMessagesResponse
    >(
      {
        contextId: jwtObject?.context_id ?? getContextId(),
        method: ClientMethod.GET_PROPOSAL_MESSAGES,
        argsJson: proposalsRequest,
        executorPublicKey: jwtObject.executor_public_key,
      },
      config,
    );
    if (response?.error) {
      return await this.handleError(
        response.error,
        {},
        this.getProposalMessages,
      );
    }

    let getProposalsResponse: GetProposalMessagesResponse = {
      proposals: response?.result?.output?.proposals,
    } as GetProposalMessagesResponse;

    return {
      data: getProposalsResponse,
      error: null,
    };
  }
  async sendProposalMessage(
    sendMessageRequest: SendMessageRequest,
  ): ApiResponse<SendMessageResponse> {
    const { jwtObject, config, error } = getConfigAndJwt();
    if (error) {
      return { error };
    }

    const response = await getJsonRpcClient().mutate<
      SendMessageRequest,
      SendMessageResponse
    >(
      {
        contextId: jwtObject?.context_id ?? getContextId(),
        method: ClientMethod.SEND_PROPOSAL_MESSAGE,
        argsJson: sendMessageRequest,
        executorPublicKey: jwtObject.executor_public_key,
      },
      config,
    );
    if (response?.error) {
      return await this.handleError(
        response.error,
        {},
        this.sendProposalMessage,
      );
    }

    let sendMessageResponse: SendMessageResponse = {
      result: response?.result?.output?.result,
    } as SendMessageResponse;

    return {
      data: sendMessageResponse,
      error: null,
    };
  }

  private async handleError(
    error: RpcError,
    params: any,
    callbackFunction: any,
  ) {
    if (error && error.code) {
      const response = await handleRpcError(error, getNodeUrl);
      if (response.code === 403) {
        return await callbackFunction(params);
      }
      return {
        error: await handleRpcError(error, getNodeUrl),
      };
    }
  }
}
