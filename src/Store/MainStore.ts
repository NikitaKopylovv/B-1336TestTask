import { combineReducers, configureStore } from "@reduxjs/toolkit"
import brigadeReducer from './BrigadesSlice'
import connectionStateReducer from "./ConnectionStatusSlice"
import departmentReducer from "./DepartmentsSlice"
import highChartReducer from "./HighChartClice"

const rootReducer = combineReducers({
    brigadeReducer,
    connectionStateReducer,
    departmentReducer,
    highChartReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false
            })
    });
};

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']