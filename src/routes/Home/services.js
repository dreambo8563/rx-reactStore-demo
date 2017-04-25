
import {store$} from 'store'

const homeState = store$.homeState

export function changeHomeProps(obj) {
    homeState
        .updateStore
        .next({
            ...obj
        })
}
