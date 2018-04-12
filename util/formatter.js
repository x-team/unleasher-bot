import interactiveComponent from '../models/interactiveComponent'
import { IM_UNLEASH_STATUS_UPDATE } from '../handlers/bot/conversations/weeklyUnleash'

const IM_POST_GOAL_CREATED = {
    callbackId: 'post_goal_created',
    actions: {
        setInProgress: 0,
        createNew: 1,
        doNothing: 2,
    }
}

const IM_POST_GOAL_SWITCHED = {
    callbackId: 'post_goal_switched'
}

const IM_POST_GOAL_COMPLETED = {
    callbackId: 'post_goal_completed'
}

const formatGoalDueDate = (date) => {
    return date.substring(0, 10)
}

const goalsToOptions = (goals) => {
    let goalOptions = []
    goals.forEach((goal) => {
        if (!goal.achieved || goal.achieved !== true) {
            goalOptions.push({
                text: goal.name,
                value: goal.id
            })
        }
    })

    return goalOptions
}

const formatInteractiveComponent = (data) => {
    let component = []
    switch (data.callbackId) {
    case IM_POST_GOAL_CREATED.callbackId:
        component = goalCreatedTemplate(data)
        break
    case IM_UNLEASH_STATUS_UPDATE.callbackId:
        const pretext = `Hi! What is your progress on ${data.name} lvl.${data.level} goal ?`
        component = goalCardTemplate(data, true, pretext)
        break
    case IM_POST_GOAL_SWITCHED.callbackId:
        component = goalCardTemplate(data, false)
        break
    case IM_POST_GOAL_COMPLETED.callbackId:
        component = goalAchieved(data)
        break
    default:
        console.log('Case miss for callbackId in formatInteractiveComponent', data.callbackId)
        break
    }

    return component
}

const goalAchieved = (data) => {
    return [
        {
            pretext: `${data.userData.profile.real_name} has completed a goal! :sparkles:`,
            attachment_type: 'default',
            color: 'good',
            fallback: 'Unleash achievement',
            title: data.name || '',
            text: data.description || '',
            thumb_url: data.userData.profile.image_512
        }
    ]
}

const goalCardTemplate = (data, actions, pretext) => {
    let template = {
        pretext,
        fallback: 'Unleash status update',
        color: '#3AA3E3',
        attachment_type: 'default',
        callback_id: data.callbackId,
        fields: [
            {
                title: 'Name',
                value: data.name,
                short: true
            },
            {
                title: 'Status',
                value: data.status,
                short: true
            },
            {
                title: 'Description',
                value: data.description,
                short: true
            },
            {
                title: 'Level',
                value: data.level,
                short: true
            },
            {
                title: 'Due date',
                value: data.dueDate,
                short: true
            },
            {
                title: 'Achieved',
                value: data.achieved ? 'Yes' : 'No',
                short: true
            }
        ]
    }

    if (actions) {
        template.actions = [
            {
                name: IM_UNLEASH_STATUS_UPDATE.actions.goalCompleted,
                text: 'Completed',
                style: interactiveComponent.COMPONENT_COLOR_GREEN,
                value: IM_UNLEASH_STATUS_UPDATE.actions.goalCompleted,
                type: interactiveComponent.IM_BUTTON_TYPE
            },
            {
                name: IM_UNLEASH_STATUS_UPDATE.actions.postponeGoal,
                text: 'I need more time',
                value: IM_UNLEASH_STATUS_UPDATE.actions.postponeGoal,
                type: interactiveComponent.IM_BUTTON_TYPE
            },
            {
                name: IM_UNLEASH_STATUS_UPDATE.actions.switchGoal,
                text: 'Switch goal here',
                type: interactiveComponent.IM_MENU_TYPE,
                options: data.dropdownOptions,
            },
            {
                name: IM_UNLEASH_STATUS_UPDATE.actions.contactUnleasher,
                text: 'Contact Real Unleasher',
                style: interactiveComponent.COMPONENT_COLOR_RED,
                value: IM_UNLEASH_STATUS_UPDATE.actions.contactUnleasher,
                type: interactiveComponent.IM_BUTTON_TYPE
            }
        ]
    }

    return [ template ]
}

const goalCreatedTemplate = (data) => {
    return [
        {
            pretext: 'Your goal has been created.',
            text: 'What shall we do next ?',
            fallback: 'Goal created',
            color: '#3AA3E3',
            attachment_type: 'default',
            callback_id: data.callbackId,
            fields: [
                {
                    title: 'Set as current',
                    value: 'Use this button to set your new goal in-progress'
                },
                {
                    title: 'Create another',
                    value: 'Use this button to create another goal'
                },
                {
                    title: 'Do nothing',
                    value: 'Use this button to dismiss. I will check up on you later.',
                }
            ],
            actions: [
                {
                    name: IM_POST_GOAL_CREATED.actions.setInProgress,
                    text: 'Set as current',
                    style: 'primary',
                    value: data.goalId,
                    type: 'button'
                },
                {
                    name: IM_POST_GOAL_CREATED.actions.createNew,
                    text: 'Create another',
                    value: 2,
                    type: 'button'
                },
                {
                    name: IM_POST_GOAL_CREATED.actions.doNothing,
                    text: 'Do nothing',
                    value: 0,
                    type: 'button'
                }
            ]
        }
    ]
}

export {
    formatGoalDueDate,
    goalsToOptions,
    formatInteractiveComponent,
    IM_POST_GOAL_CREATED,
    IM_POST_GOAL_COMPLETED,
    IM_POST_GOAL_SWITCHED
}
