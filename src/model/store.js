import {createStore} from 'rx-reactstore'
const initailSub = {
    a: 123,
    b: [
        1, 2, 3, 4
    ],
    c: {
        xx: 'ok'
    },
    user:{
        name:'name1111'
    }
}

export const subStreamStore = createStore(initailSub, 'subStore')

subStreamStore
    .a
    .map(v => ({a: v}))
    .subscribe(subStreamStore.updateStore)
subStreamStore
    .b
    .map(v => ({b: v, a: 'newa'}))
    .subscribe(subStreamStore.updateStore)

subStreamStore
    .c
    .xx
    .map(v => ({xx: v}))
    .subscribe(subStreamStore.c.updateStore)
