const IM_CREATE_UNLEASH_GOAL = {
    callbackId: 'no_goals_message',
    actions: {
        createGoal: 0,
        doNothing: 1,
        contactUnleasher: 2,
    } 
}

const addMessageAskCreateGoal = (convo) => {
    convo.addMessage({
        text: 'Hi! I can see that you have no goals yet. Shal we create one?',
        response_type: 'in_channel',
        attachments: [
            {
                'fallback': 'Create goal',
                'color': '#3AA3E3',
                'attachment_type': 'default',
                'callback_id': IM_CREATE_UNLEASH_GOAL.callbackId,
                'actions': [
                    {
                        'name': IM_CREATE_UNLEASH_GOAL.actions.createGoal,
                        'text': 'Create Goal',
                        'style': 'primary',
                        'value': IM_CREATE_UNLEASH_GOAL.actions.createGoal,
                        'type': 'button',
                    },
                    {
                        'name': IM_CREATE_UNLEASH_GOAL.actions.doNothing,
                        'text': 'Not today ...',
                        'value': IM_CREATE_UNLEASH_GOAL.actions.doNothing,
                        'type': 'button',
                    },
                    {
                        'name': IM_CREATE_UNLEASH_GOAL.actions.contactUnleasher,
                        'text': 'Contact Real Unleasher',
                        'style': 'danger',
                        'value': IM_CREATE_UNLEASH_GOAL.actions.contactUnleasher,
                        'type': 'button',
                    }
                ]
            }
        ]
    },
    'createUnleashGoal_askCreateGoal'
    )
}

export {
    addMessageAskCreateGoal,
    IM_CREATE_UNLEASH_GOAL
}
