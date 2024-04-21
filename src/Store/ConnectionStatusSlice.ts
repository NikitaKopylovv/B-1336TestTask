import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


interface ConnectionSliceState {
    connectionStates: ConnectionState[];
    status: 'default' | 'loading' | 'succesed' | 'failed';
    error: string | null;
}

export interface ConnectionState {
    connectionStateId: number,
    name: string;
}

const initialState: ConnectionSliceState = {
    connectionStates: [],
    status: 'default',
    error: null
}

export const fetchConnectionStatuses = createAsyncThunk('brigades/fetchConnectionStatuses', async () => {
    const response = await axios.get<ConnectionState[]>('https://v1336-api-test.onrender.com/getConnectionState');
    return response.data;
});

const connectionStatusSlice = createSlice({
    name: 'connectionStatuses',
    initialState,
    reducers: {
        getConnectionStates: (state, action: PayloadAction<ConnectionState[]>) => {
            state.connectionStates = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchConnectionStatuses.pending, state => {
            state.status = 'loading';
        })
            .addCase(fetchConnectionStatuses.fulfilled, (state, action: PayloadAction<ConnectionState[]>) => {
                state.status = 'succesed';
                state.connectionStates = action.payload;
            })
            .addCase(fetchConnectionStatuses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    }
})

export default connectionStatusSlice.reducer;