import { createStore, store } from 'rx-reactstore'
import { userState } from 'modules/User/model'

export const initailStore = {
  loading: false,
  userInfo: {
    userName: undefined,
    phoneNum: undefined
  },
  error: {
    title: undefined,
    content: undefined,
    cb: undefined
  },
  success: {
    title: undefined,
    content: undefined,
    cb: undefined
  },
  confirm: {
    title: undefined,
    content: undefined,
    onOk: () => {},
    onCancel: () => {}
  },
  modal: {
    visible: false,
    title: undefined,
    content: undefined,
    handleOk: undefined,
    handleCancel: undefined
  }
}

export const store$ = createStore(
  {
    ...initailStore,
    userState
  },
  'store'
)

// store$     .a     .map(v => ({a: v}))     .subscribe(store$.updateStore)
// store$     .b     .map(v => ({b: v}))     .subscribe(store$.updateStore)
// store$     .c     .xx     .map(v => ({xx: v}))
// .subscribe(store$.c.updateStore) store$     .user     .name     .map(v =>
// ({name: v}))     .subscribe(store$.c.updateStore)

export function getStore() {
  return store
}
