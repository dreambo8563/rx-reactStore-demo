import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/dom/ajax'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
import {store$} from 'store'

const defaultOption = {
    crossDomain: true,
    withCredentials: true
}

export const jsonCommon = (options) => {
    store$
        .updateStore
        .next({loading: true})
    return Observable
        .ajax({
        ...options,
        ...defaultOption
    })
        .catch(err => {
            store$
                .updateStore
                .next({loading: false})
            return Observable.of(err)
        })
        .filter(res => {
            if (res.status === 403) {
                console.log('get 403 response')
                return false
            }
            if (res.status === 404) {
                console.log('get 404 response')
                return false
            }
            if (res.status >= 500) {
                console.log('server error');
                return false
            }
            if (res.status === 200 || res.status === 201) {
                console.log('get response');
                return true
            }
        })
        .map(res => {
            store$
                .updateStore
                .next({loading: false})
            return res
        })
}

export const jsonGet = (url) => {
    return jsonCommon({method: 'GET', url})
}

export const jsonPost = (url, body) => {
    return jsonCommon({method: 'POST', url, body})
}
