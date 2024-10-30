import { ApiResponse } from '@calimero-is-near/calimero-p2p-sdk';

export interface ContractProposal {}

//
export interface CalimeroProposalMetadata {}

export interface ContextDetails {}

export interface Members {
  publicKey: String;
}

export interface Message {
  proposalId: String;
  publicKey: String;
  text: String;
}

export interface GetProposalMessagesRequest {
  proposalId: String;
}

export interface GetProposalMessagesResponse {
  proposals: CalimeroProposalMetadata[];
}

export interface SendMessageRequest {
  proposalId: String;
  publicKey: String;
  text: String;
}

export interface SendMessageResponse {
  result: boolean;
}

export enum ClientMethod {
  GET_PROPOSAL_MESSAGES = 'get_proposal_messages',
  SEND_PROPOSAL_MESSAGE = 'send_proposal_message',
}

export interface ClientApi {
  //Cali Storage
  getProposalMessages(
    proposalsRequest: GetProposalMessagesRequest,
  ): ApiResponse<GetProposalMessagesResponse>;
  sendProposalMessage(
    sendMessageRequest: SendMessageRequest,
  ): ApiResponse<SendMessageResponse>;
}
