import {createStore, store} from 'rx-reactstore'
import {userState} from 'modules/User/model'

export const initailStore = {
    a: 123,
    b: [
        1, 2, 3, 4
    ],
    c: {
        xx: 'ok'
    },
    user: {
        name: 'name1111'
    }
}

export const store$ = createStore({
    ...initailStore,
    userState
}, 'store')

store$
    .a
    .map(v => ({a: v}))
    .subscribe(store$.updateStore)

store$
    .b
    .map(v => ({b: v}))
    .subscribe(store$.updateStore)

store$
    .c
    .xx
    .map(v => ({xx: v}))
    .subscribe(store$.c.updateStore)

store$
    .user
    .name
    .map(v => ({name: v}))
    .subscribe(store$.c.updateStore)

export function getStore() {
    return store
}
