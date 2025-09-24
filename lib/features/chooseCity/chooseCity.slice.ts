import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type choosenCity = {
    name: string,
    latitude: number,
    longitude: number,
    country: string,
}

const initialstate: choosenCity = {
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.69171,
    country: 'Japan',
}

export const choosenCitySlice = createSlice({
    name: 'choosenCity',
    initialState: initialstate,
    reducers: {
        setChoosenCity: (state, action: PayloadAction<choosenCity>) => {
            state.name = action.payload.name;
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.country = action.payload.country;
        },
    },
});



export const { setChoosenCity } = choosenCitySlice.actions
export default choosenCitySlice.reducer