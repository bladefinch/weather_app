
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TemperatureUnit = "celsius" | "fahrenheit"
export type WindSpeedUnit = "km/h" | "mph"
export type PrecipitationUnit = "mm" | "in"
type WeatherUnits = {
    temperatureUnit: TemperatureUnit;
    windSpeedUnit: WindSpeedUnit;
    precipitationUnit: PrecipitationUnit;
}

const initialState: WeatherUnits = {
    temperatureUnit: 'celsius' ,
    windSpeedUnit: 'km/h',
    precipitationUnit: 'mm'
}

export const weatherUnitsSetSlice = createSlice({
    name: 'weatherUnitsSet',
    initialState,
    reducers: {
        setTemperatureUnit: (state, action: PayloadAction<TemperatureUnit>) => {
            state.temperatureUnit = action.payload;
        },
        setWindSpeedUnit: (state, action: PayloadAction<WindSpeedUnit>) => {
            state.windSpeedUnit = action.payload;
        },
        setPrecipitationUnit: (state, action: PayloadAction<PrecipitationUnit>) => {
            state.precipitationUnit = action.payload;
        },
        setImperialUnits: (state) => {
            state.temperatureUnit = 'fahrenheit';
            state.windSpeedUnit = 'mph';
            state.precipitationUnit = 'in';
        },
    },
});


export const { setTemperatureUnit, setWindSpeedUnit, setPrecipitationUnit, setImperialUnits } = weatherUnitsSetSlice.actions;

export default weatherUnitsSetSlice.reducer;