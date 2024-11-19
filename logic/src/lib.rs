use calimero_sdk::app;
use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::env::ext::ProposalId;
use calimero_sdk::env::{self};
use calimero_sdk::serde::{Deserialize, Serialize};
use calimero_sdk::types::Error;
use calimero_storage::collections::UnorderedMap;
use calimero_storage::entities::Element;
use calimero_storage::AtomicUnit;

#[derive(Clone, Debug, PartialEq, PartialOrd, Deserialize)]
#[serde(crate = "calimero_sdk::serde")]
pub struct CreateProposalRequest {}

#[derive(Clone, Debug, PartialEq, PartialOrd, Deserialize)]
#[serde(crate = "calimero_sdk::serde", rename_all = "camelCase")]
pub struct GetProposalMessagesRequest {
    proposal_id: String,
}

#[derive(Clone, Debug, PartialEq, PartialOrd, Deserialize)]
#[serde(crate = "calimero_sdk::serde", rename_all = "camelCase")]
pub struct SendProposalMessageRequest {
    proposal_id: String,
    message: Message,
}

#[app::event]
pub enum Event {
    ProposalCreated(),
}

#[app::state(emits = Event)]
#[derive(AtomicUnit, Clone, Debug, PartialEq, PartialOrd)]
#[root]
#[type_id(1)]
pub struct AppState {
    count: u32,
    #[storage]
    storage: Element,

    messages: UnorderedMap<env::ext::ProposalId, Vec<Message>>,
}

#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Message {
    id: String,
    proposal_id: String,
    author: String,
    text: String,
    created_at: String,
}

#[app::logic]
impl AppState {
    #[app::init]
    pub fn init() -> AppState {
        AppState {
            count: 0,
            storage: Element::root(),
            messages: UnorderedMap::new().unwrap(),
        }
    }

    pub fn create_new_proposal(receiver: String) -> Result<env::ext::ProposalId, Error> {
        env::log("env Call in wasm create new proposal");
        let account_id = env::ext::AccountId(receiver);
        let amount = 1_000_000_000_000_000_000_000;
        let proposal_id = Self::external()
            .propose()
            .transfer(account_id, amount)
            .send();
        env::log(&format!("Create new proposal with id: {:?}", proposal_id));
        Ok(proposal_id)
    }

    pub fn approve_proposal(proposal_id: ProposalId) -> Result<bool, Error> {
        env::log(&format!("Approve proposal: {:?}", proposal_id));
        let _ = Self::external().approve(proposal_id);
        Ok(true)
    }

    pub fn get_proposal_messages(&self, proposal_id: ProposalId) -> Result<Vec<Message>, Error> {
        env::log(&format!("Get messages for proposal: {:?}", proposal_id));
        let res = &self.messages.get(&proposal_id).unwrap();
        env::log(&format!(
            "Get messages for proposal from storage: {:?}",
            res
        ));
        match res {
            Some(messages) => Ok(messages.clone()),
            None => Ok(vec![]),
        }
    }

    pub fn send_proposal_messages(
        &mut self,
        proposal_id: ProposalId,
        message: Message,
    ) -> Result<bool, Error> {
        env::log(&format!(
            "send_proposal_messages with id : {:?}",
            proposal_id
        ));
        env::log(&format!("send_proposal_messages msg: {:?}", message));

        let proposal_messages = self.messages.get(&proposal_id).unwrap();
        match proposal_messages {
            Some(mut messages) => {
                messages.push(message);
                self.messages.insert(proposal_id, messages)?;
            }
            None => {
                let messages = vec![message];
                self.messages.insert(proposal_id, messages)?;
            }
        }
        Ok(true)
    }
}
