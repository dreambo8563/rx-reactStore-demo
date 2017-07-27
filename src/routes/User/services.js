
import {store$} from 'store'

const userState = store$.userState

const userForm = store$.userState.form
export function changeUserProps(obj) {
    userState
        .updateStore
        .next({
            ...obj
        })
}

export function changeUserForm(obj) {
    userForm
        .updateStore
        .next({
            ...obj
        })
}
