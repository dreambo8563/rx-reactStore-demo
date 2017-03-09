
import {store$} from 'store'

const userState = store$.userState

export function changeUserProps(obj) {
    userState
        .updateStore
        .next({
            ...obj
        })
}
