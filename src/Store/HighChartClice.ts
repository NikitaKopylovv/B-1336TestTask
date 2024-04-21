import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface FetchPoint {
    x: Date;
    y: number;
}

interface HighChartState {
    points: FetchPoint[];
    status: 'default' | 'loading' | 'succesed' | 'failed';
    error: string | null;
}

const initialState: HighChartState = {
    points: [],
    status: 'default',
    error: null
}

export const fetchPoints = createAsyncThunk('points/fetchPoints', async (pointsNumber: number | null) => {
    console.log("pointsNumber: ", pointsNumber);
    const response = await axios.get<FetchPoint[]>(`https://v1336-api-test.onrender.com/getPointsFast?points=${pointsNumber}`);
    return response.data.map((point) => ({
        x: new Date(point.x),
        y: point.y
    }));
});

const highChartSlice = createSlice({
    name: 'brigades',
    initialState,
    reducers: {
        getPoints: (state, action: PayloadAction<FetchPoint[]>) => {
            state.points = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPoints.pending, state => {
            state.status = 'loading';
        })
            .addCase(fetchPoints.fulfilled, (state, action: PayloadAction<FetchPoint[]>) => {
                state.status = 'succesed';
                state.points = action.payload;
            })
            .addCase(fetchPoints.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    }
})

export default highChartSlice.reducer;