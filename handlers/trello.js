import trello from 'node-trello'

const trelloClient = new trello(process.env.trello_dev_key, process.env.trello_token)
const trelloGuestClient = new trello(process.env.trello_guest_dev_key, process.env.trello_guest_token)

const addCommentToCard = (cardId, comment) => {
	trelloGuestClient.post(`/1/cards/${cardId}/actions/comments`, { text: comment }, (err, data) => {})
}

export {
  addCommentToCard,
}
