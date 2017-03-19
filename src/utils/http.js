import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

const defaultOption = {
    crossDomain: true,
    withCredentials: true
}
export const jsonGet = (url) => {
    return Observable
        .ajax({
        url,
        method: 'GET',
        ...defaultOption
    })
        .catch(err => Observable.of(err))
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
            if (res.status === 200) {
                console.log('get response');
                return true
            }
        })
}
