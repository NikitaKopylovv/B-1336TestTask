import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Brigade {
    id: number;
    brigade_name: string;
    connectionStateId: number;
    department: {
        id: number;
    };
    position: {
        field: string;
        cluster: number;
        well: number;
    }
}

interface BrigadeState {
    brigades: Brigade[];
    status: 'default' | 'loading' | 'succesed' | 'failed';
    error: string | null;
}

const initialState: BrigadeState = {
    brigades: [],
    status: 'default',
    error: null
}

export const fetchBrigades = createAsyncThunk('brigades/fetchBrigades', async () => {
    const response = await axios.get<Brigade[]>('https://v1336-api-test.onrender.com/getBrigadesData');
    return response.data;
});

const brigadesSlice = createSlice({
    name: 'brigades',
    initialState,
    reducers: {
        getBrigades: (state, action: PayloadAction<Brigade[]>) => {
            state.brigades = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBrigades.pending, state => {
            state.status = 'loading';
        })
            .addCase(fetchBrigades.fulfilled, (state, action: PayloadAction<Brigade[]>) => {
                state.status = 'succesed';
                state.brigades = action.payload;
            })
            .addCase(fetchBrigades.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    }
})

export default brigadesSlice.reducer;