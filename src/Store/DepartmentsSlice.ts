import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Department {
    id: number;
    name: string;
}

interface DepartmentSliceState {
    departmentState: Department[];
    status: 'default' | 'loading' | 'succesed' | 'failed';
    error: string | null;
}

const initialState: DepartmentSliceState = {
    departmentState: [],
    status: 'default',
    error: null
}

export const fetchDepartments = createAsyncThunk('brigades/fetchDepartments', async () => {
    const response = await axios.get<Department[]>('https://v1336-api-test.onrender.com/getDepartments');
    return response.data;
});

const departmentsSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        getDepartments: (state, action: PayloadAction<Department[]>) => {
            state.departmentState = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDepartments.pending, state => {
            state.status = 'loading';
        })
            .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
                state.status = 'succesed';
                state.departmentState = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
    }
})

export default departmentsSlice.reducer;