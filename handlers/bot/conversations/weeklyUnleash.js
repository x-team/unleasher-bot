import { goalsToOptions, formatInteractiveComponent } from '../../../util/formatter'
import interactiveComponent from '../../../models/interactiveComponent'

const addMessageAskGoalCompletion = (convo, bot, goal, goals) => {
    console.log('addMessageAskGoalCompletion')
    const dropdownOptions = goalsToOptions(goals)
    // here we could check if the due date is still in the future. If so maybe button "I need more time" should just reasure that there is still time left.
    // or maybe we should change the flow on "I need more time" and in any case it's used it should as for "How much more time do you need ? "
    const data = goal
    data.callbackId = interactiveComponent.IM_MSG_TYPE_STATUS_UPDATE
    data.dropdownOptions = dropdownOptions
    convo.addMessage({
        'attachments': formatInteractiveComponent(data)
    },
    'weeklyUnleash_askGoalCompletion'
    )
}

const IM_START_UNLEASH = {
    callbackId: 'no_in_progress_message',
    actions: {
        chooseExising: 0,
        createNew: 1,
        doNothing: 2,
        contactUnleasher: 3,
    } 
}

const addMessageAskChooseGoal = (convo, bot, goals) => {
    const dropdownOptions = goalsToOptions(goals)
    convo.addMessage({
        text: 'You have no goal in progress right now. You can choose to work on one of the existing goals or create a new one.',
        response_type: 'in_channel',
        attachments: [
            {
                'fallback': 'Select or create new goal',
                'color': '#3AA3E3',
                'attachment_type': 'default',
                'callback_id': IM_START_UNLEASH.callbackId,
                'actions': [
                    {
                        'name': IM_START_UNLEASH.actions.chooseExising,
                        'text': 'Select existing goal',
                        'type': 'select',
                        'options': dropdownOptions,
                    },
                    {
                        'name': IM_START_UNLEASH.actions.createNew,
                        'text': 'Create Goal',
                        'style': 'primary',
                        'value': IM_START_UNLEASH.actions.createNew,
                        'type': 'button',
                    },
                    {
                        'name': IM_START_UNLEASH.actions.doNothing,
                        'text': 'Not today ...',
                        'value': IM_START_UNLEASH.actions.doNothing,
                        'type': 'button',
                    },
                    {
                        'name': IM_START_UNLEASH.actions.contactUnleasher,
                        'text': 'Contact Real Unleasher',
                        'style': 'danger',
                        'value': IM_START_UNLEASH.actions.contactUnleasher,
                        'type': 'button',
                    }
                ]
            }
        ]
    },
    'weeklyUnleash_askChooseGoal'
    )
}

const addMessageAskMaybeCreateGoal = (convo, bot) => {
    convo.addQuestion('Maybe you would like to create a new goal?', [
        {
            pattern: bot.utterances.yes,
            callback: () => { convo.gotoThread('createUnleashGoal_askDescription') },
        },
        {
            pattern: bot.utterances.no,
            callback: () => { convo.gotoThread('bye') },
        },
        {
            default: true,
            callback: () => {
                convo.repeat()
            },
        }
    ], {},
    'weeklyUnleash_askMaybeCreateGoal')
}

export {
    addMessageAskGoalCompletion,
    addMessageAskChooseGoal,
    addMessageAskMaybeCreateGoal,
    IM_START_UNLEASH,
}
