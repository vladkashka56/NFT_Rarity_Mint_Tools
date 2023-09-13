import { configureStore } from '@reduxjs/toolkit'
import progressReducer from '../pages/client/SearchPage/partial/updateScrappingProgress'
import forceReducer from '../pages/client/SearchPage/partial/updateForceFlag'
import limitReachedReducer from '../pages/client/SearchPage/partial/updateNftLimit'
import dataFreshnessReducer from '../pages/client/SearchPage/partial/updateFreshness'

export const store = configureStore({
  reducer: {
    scrappingProgress: progressReducer,
    forceFlag: forceReducer,
    nftLimitReached: limitReachedReducer,
    dataFreshnessTs: dataFreshnessReducer
  },
})