import {
    handleGoalCreated,
    handleCreateUnleashGoalChoice,
    handleSelectOrCreateGoalChoice,
    handlePostGoalCreatedChoice,
    handleUnleashStatusUpdateChoice,
} from '../../handlers/main'
import { IM_CREATE_UNLEASH_GOAL } from '../../handlers/bot/conversations/createUnleashGoal'
import { DIALOG_CREATE_UNLEASH_GOAL } from '../../handlers/api/slack/dialog'
import { IM_START_UNLEASH, IM_UNLEASH_STATUS_UPDATE } from '../../handlers/bot/conversations/weeklyUnleash'
import { IM_POST_GOAL_CREATED } from '../../util/formatter'

const IC_TYPE_DIALOG = 'dialog_submission'
const IC_TYPE_MESSAGE = 'interactive_message'
const IC_ACTION_BUTTON = 'button'
const IC_ACTION_SELECT = 'select'

export default async (req, res, next) => {
    if (req.body.payload) {
        const payload = JSON.parse(req.body.payload)
        switch (payload.type) {
        case IC_TYPE_DIALOG:
            switch (payload.callback_id) {
            case DIALOG_CREATE_UNLEASH_GOAL.callbackId:
                res.locals = { respond: false }
                handleGoalCreated(payload)
                break

            default:
                console.log(`Unsupported callback id: ${payload.callback_id}`)
                break
            }

            break

        case IC_TYPE_MESSAGE:
            switch (payload.actions[0].type) {
            case IC_ACTION_BUTTON:
                res.locals = { respond: true }
                switch (payload.callback_id) {
                case IM_CREATE_UNLEASH_GOAL.callbackId:
                    res.locals.message = await handleCreateUnleashGoalChoice(payload)
                    console.log('locals:', res.locals)
                    break

                case IM_START_UNLEASH.callbackId:
                    res.locals.message = handleSelectOrCreateGoalChoice(payload)
                    break

                case IM_POST_GOAL_CREATED.callbackId:
                    res.locals.message = handlePostGoalCreatedChoice(payload)
                    break

                case IM_UNLEASH_STATUS_UPDATE.callbackId:
                    res.locals.message = handleUnleashStatusUpdateChoice(payload)
                    break
                
                default:
                    res.locals.message = `Unsupported button callbackId: ${payload.callback_id} - please contact admin.`
                    break
                }
                
                break

            case IC_ACTION_SELECT:
                res.locals = { respond: true }
                switch (payload.callback_id) {
                case IM_START_UNLEASH.callbackId:
                    handleSelectOrCreateGoalChoice(payload)
                    break
                
                case IM_UNLEASH_STATUS_UPDATE.callbackId:
                    handleUnleashStatusUpdateChoice(payload)
                    break

                default:
                    console.log('Unsupported menu callback id: ', payload.callback_id)
                    break
                }

                break

            default:
                console.log('Unsupported message actions type: ', payload.actions[0].type)
                break
            }

            break
            
        default:
            console.log('Unsupported payload type:', payload)
            break
        }
    }
    next()
}


// if ([interactiveComponentModel.IM_MSG_TYPE_CREATE_FIRST_GOAL,
//     interactiveComponentModel.IM_MSG_TYPE_STATUS_UPDATE,
//     interactiveComponentModel.IM_MSG_TYPE_SELECT_OR_CREATE,
//     interactiveComponentModel.IM_MSG_TYPE_AFTER_GOAL_CREATED
// ].includes(payload.callback_id)) {
//     switch (payload.actions[0].name) {
//     case interactiveComponentModel.GENERIC_YES:
//         console.log('handleGoalCompleted()') //handleGoalCompleted()
//         break

//     case interactiveComponentModel.GENERIC_NO:
//         console.log('handleGoalPostponed()') //handleGoalPostponed()
//         break

//     case interactiveComponentModel.ACTION_CONTACT_MY_UNLEASHER:
//         console.log('handleContactUnleasher()') //handleContactUnleasher()
//         break

//     case interactiveComponentModel.ACTION_GOAL_COMPLETED:
//         console.log('handleGoalCompleted()') //handleGoalCompleted()
//         break

//     case interactiveComponentModel.ACTION_MORE_TIME:
//         console.log('handleGoalPostponed()') //handleGoalPostponed()
//         break

//     case interactiveComponentModel.ACTION_CREATE_NEW_GOAL:
//         console.log('handleStartCreatingGoal()') //handleStartCreatingGoal()
//         break

//     case interactiveComponentModel.ACTION_SET_GOAL_IN_PROGRESS:
//         console.log('handleSetGoalInProgress()') //handleSetGoalInProgress()
//         break

//     default:
//         console.log('IC_BUTTON default: ', payload)
//         break
//     }
// }




// if ([interactiveComponentModel.IM_MSG_TYPE_CURRENT_GOAL,
//     interactiveComponentModel.IM_MSG_TYPE_SELECT_OR_CREATE,
//     interactiveComponentModel.IM_MSG_TYPE_STATUS_UPDATE
// ].includes(payload.callback_id)) {
//     console.log('handleSwitchGoal()') //handleSwitchGoal()
// } 