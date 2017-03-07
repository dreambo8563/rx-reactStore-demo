// import getStream from 'utils/getStream' import {getStore} from 'model' import
// {Subject} from 'rxjs/Subject';
import {store$} from 'model'

// const userStream = {}
console.log();
export function changeUserProps(obj) {
    store$
        .userState
        .updateStore
        .next({
            ...obj
        })
}
