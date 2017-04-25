import {createStore, store} from 'rx-reactstore'
import {homeState} from 'modules/Home/model'

export const initailStore = {
    loading: false
}

export const store$ = createStore({
    ...initailStore,
    homeState
}, 'store')

// store$
//     .a
//     .map(v => ({a: v}))
//     .subscribe(store$.updateStore)

// store$
//     .b
//     .map(v => ({b: v}))
//     .subscribe(store$.updateStore)

// store$
//     .c
//     .xx
//     .map(v => ({xx: v}))
//     .subscribe(store$.c.updateStore)

// store$
//     .user
//     .name
//     .map(v => ({name: v}))
//     .subscribe(store$.c.updateStore)

export function getStore() {
    return store
}
