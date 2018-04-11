import slack from 'slack-node'

import { getBotData } from '../../bot'

const openDialog = async (team, trigger) => {
    const botData = getBotData(team)
    const slackClient = new slack(botData.config.token)
    const dialog = {
        'callback_id': 'create_goal_1',
        'title': 'Create Unleash Goal',
        'submit_label': 'Create',
        'elements': [
            {
                'type': 'text',
                'label': 'Name',
                'name': 'goal_name',
                'hint': 'Give it a good name, maybe something like "Reactive Developer"'
            },
            {
                'type': 'textarea',
                'label': 'Description',
                'name': 'goal_description',
                'hint': 'How would you describe the goal in one sentence? Example: Implement a hello world application in React.js'
            }
        ]
    }
    const data = {
        trigger_id: trigger,
        dialog: JSON.stringify(dialog)
    }
    return new Promise((resolve, reject) => {
        slackClient.api('dialog.open', data, (err, response) => {
            if (err) {
                reject(err)
            } else {
                resolve(response)
            }
        })
    })
}

export {
    openDialog
}
