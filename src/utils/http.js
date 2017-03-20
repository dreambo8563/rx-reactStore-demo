import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/dom/ajax'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/forkjoin'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/reduce'
import {store$} from 'store'

const defaultOption = {
    crossDomain: true,
    withCredentials: true,
    timeout: 3000
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
        .catch(err => Observable.of(err))
        .filter(res => {
            store$
                .updateStore
                .next({loading: false})
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
            if (res.status === 0) {
                console.log('timeout issue');
                return false
            }
            if (res.status === 200 || res.status === 201) {
                console.log('get correct response');

                return true
            }
            console.log(res, 'other status code');
        })
        .map(res => res.response)
}

export const jsonGet = (url) => {
    return jsonCommon({method: 'GET', url})
}

export const jsonPost = (url, body) => {
    return jsonCommon({method: 'POST', url, body})
}

export const jsonPut = (url, body) => {
    return jsonCommon({method: 'PUT', url, body})
}

export const jsonDelete = (url) => {
    return jsonCommon({method: 'DELETE', url})
}

export const allFinishedFor = (arr) => {
    const obsArr = arr.map(x => Observable.ajax({
        ...x,
        ...defaultOption
    }))
    store$
        .updateStore
        .next({loading: true})
    return Observable
        .forkJoin(obsArr)
        .catch(e => Observable.of(e))
        .filter(res => {
            store$
                .updateStore
                .next({loading: false})
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
            if (res.status === 0) {
                console.log('timeout issue');
                return false
            }

            return true
        })
        .map(arr => arr.map(item => item.response))
}
