use std::vec;

use calimero_sdk::{
    app,
    borsh::{BorshDeserialize, BorshSerialize},
};

#[app::event]
pub enum Event {
    ProposalCreated(),
}

#[app::state(emits = Event)]
#[derive(Default, BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct AppState {
    count: u32,
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct Proposal {
    id: String,
    title: String,
    description: String,
    status: ProposalStatus,
    execution_status: ExecutionStatus,
    author: String,
    created_at: u64,
    start_date: Option<u64>,
    end_date: Option<u64>,
    vote: Option<Vote>,
    action: Action,
}

impl Proposal {
    pub fn has_voted(&self) -> bool {
        self.vote.is_some()
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub enum ProposalStatus {
    Active(),
    Executed(),
    Finished(),
    Pending(),
}

impl Default for ProposalStatus {
    fn default() -> Self {
        ProposalStatus::Pending()
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub enum ExecutionStatus {
    Pending(),
    Success(),
    Failure(),
}

impl Default for ExecutionStatus {
    fn default() -> Self {
        ExecutionStatus::Pending()
    }
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct Vote {
    id: String,
    proposal_id: String,
    voter_id: String,
    vote_type: VoteType,
    voted_at: u64,
}

#[derive(BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub enum VoteType {
    Pending(),
    Accept(),
    Reject(),
}

impl Default for VoteType {
    fn default() -> Self {
        VoteType::Pending()
    }
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct Message {
    id: String,
    proposal_id: String,
    author: String,
    text: String,
    created_at: u64,
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct Member {
    id: String,
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct GetProposalsRequest {
    proposal_id: String,
    author: Option<String>,
    status: ProposalStatus,
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct CreateProposalRequest {
    proposal_id: String,
    author: Option<String>,
    status: ProposalStatus,
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct VoteRequest {
    proposal_id: String,
    vote_type: VoteType,
}

#[derive(BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub enum Action {
    TransferFunds(TransferFundsAction),
    NoAction(),
    ChangeNumberOfApproval,
    CallExternalContract,
}

#[derive(BorshDeserialize, BorshSerialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct TransferFundsAction {
    title: String,
    description: String,
    amount: u16,
    destination_account: String,
    source_account: String,
    chain: String,
}

impl Default for Action {
    fn default() -> Self {
        Action::NoAction()
    }
}

#[app::logic]
impl AppState {
    #[app::init]
    pub fn init() -> AppState {
        AppState::default()
    }

    pub fn create_new_proposal(request: CreateProposalRequest) -> bool {
        true
    }

    // Messages (discussion)
    pub fn get_proposal_messages(proposal_id: String) -> Vec<Message> {
        vec![]
    }
    pub fn send_message(proposal_id: String, message: Message) -> bool {
        true
    }
}

// Frontend

//Proposals
//     pub fn get_proposals(request: GetProposalsRequest) -> Vec<Proposal> {
//         vec![]
//     }
//     pub fn get_num_of_proposals(proposal_id: String) -> u16 {
//         0
//     }
//     pub fn get_proposal_details(proposal_id: String) -> Proposal {
//         Proposal::default()
//     }
// pub fn vote_for_proposal(request: VoteRequest) -> bool {
//     true
// }

// pub fn get_context_details()->ContextDetails{
//     ContextDetails::default()
// }

// pub fn  invite_to_context(invitationRequest)-> bool{

// }

// //Context
// pub fn get_context_members() -> Vec<Member> {
//     vec![]
// }

// pub fn get_context_members_count() -> u16 {
//     0
// }
