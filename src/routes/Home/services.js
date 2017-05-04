import {store$} from 'store'

const homeState = store$.homeState

export function changeHomeProps(obj) {
    // console.log(homeState.employeeNum);
    homeState
        .updateStore
        .next({
            ...obj
        })
}

// homeState
//     .updateStore
//     .subscribe(x => console.log(x))

// store$.updateStore.subscribe(x => console.log(x))