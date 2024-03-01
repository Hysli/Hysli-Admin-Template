import { IAsyncRouteState } from '@/store/modules/asyncRoute'
import { IScreenLockState } from '@/store/modules/screenLock'
import { ITabsViewState } from '@/store/modules/tabsView'

export interface IStore {
  asyncRoute: IAsyncRouteState
  screenLock: IScreenLockState
  tabsView: ITabsViewState
  count: number
}
