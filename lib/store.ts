import { configureStore } from '@reduxjs/toolkit'
import weatherUnitsSetReducer from './features/weather/weatherUnitsSet.slice'
import choosenCityReducer from './features/chooseCity/chooseCity.slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      weatherUnitsSet: weatherUnitsSetReducer,
      choosenCity: choosenCityReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']