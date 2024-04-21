import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Spin, Row, Alert } from 'antd';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import { useAppDispatch, useAppSelector } from '../../redux';
import { fetchBrigades } from '../../Store/BrigadesSlice';
import { fetchConnectionStatuses } from '../../Store/ConnectionStatusSlice';
import { fetchDepartments } from '../../Store/DepartmentsSlice'
import BrigadeTile from './BrigadeTile';
import BrigadeFilters from './BrigadeFilters';
import '../../styles/Brigade/BrigadeList.css';

const BrigadeList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { brigades, status, error } = useAppSelector(state => state.brigadeReducer);
    const [filter, setFilter] = useState<{ connectionId: number | null; department: number | null }>({
        connectionId: null,
        department: null,
    });
    const departments = useAppSelector(state => state.departmentReducer.departmentState);
    const connectionStates = useAppSelector(state => state.connectionStateReducer.connectionStates);

    const minCardWidth = 215;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleConnectionChange = useCallback((value: number | undefined) => {
        setFilter(prev => ({ ...prev, connectionId: value != null ? value : null })); // не проверяем на undefined, потому что нестрогое равенство сделает это автоматически
    }, []);

    const handleDepartmentChange = useCallback((value: number | undefined) => {
        setFilter(prev => ({ ...prev, department: value != null ? value : null })); // аналогично handleConnectionChange
    }, []);

    const itemsPerRow = useMemo(() => Math.floor(windowWidth / minCardWidth), [windowWidth]);


    const getItemSize = (index: number) => {
        const totalRows = Math.ceil(filteredBrigades.length / itemsPerRow);
        return index < totalRows ? 280 : 0;
    };

    // Функция фильтрации бригад
    const filteredBrigades = useMemo(() => {
        return brigades.filter(brigade => {
            const matchesConnection = filter.connectionId != null ? brigade.connectionStateId === filter.connectionId : true;
            const matchesDepartment = filter.department != null ? brigade.department.id === filter.department : true;
            return matchesConnection && matchesDepartment;
        });
    }, [brigades, filter.connectionId, filter.department]);


    useEffect(() => {
        if (brigades.length === 0) {
            dispatch(fetchBrigades());
        };
        if (departments.length === 0) {
            dispatch(fetchDepartments());
        };
        if (connectionStates.length === 0) {
            dispatch(fetchConnectionStatuses());
        };

    }, [dispatch, brigades.length, departments.length, connectionStates.length]);

    if (status === 'loading') return <Spin size="large" />;

    if (status === 'failed') {
        return (
            <Alert
                message="Error"
                description={error || "Failed to fetch data from the server."}
                type="error"
            />
        );
    }

    const renderRow = ({ index, style }: ListChildComponentProps) => {
        const items = [];
        const start = index * itemsPerRow;
        const end = start + itemsPerRow;

        for (let i = start; i < end && i < filteredBrigades.length; i++) {
            const brigade = filteredBrigades[i];
            const department = departments.find(department => department.id === brigade.department?.id)?.name || "Неизвестный";
            const connectionState = connectionStates.filter(connectionState => connectionState.connectionStateId === brigade.connectionStateId)[0] || "Неизвестный";
            items.push(
                <BrigadeTile
                    key={brigade.id}
                    id={brigade.id}
                    brigade_name={brigade.brigade_name}
                    connectionState={connectionState}
                    departmentName={department}
                    position={brigade.position}
                />
            );
        }

        return (
            <Row className='row-brigade-list' gutter={16} style={{
                ...style,
            }}>
                {items}
            </Row>
        );
    };




    return (
        <>
            <BrigadeFilters connectionStates={connectionStates} departments={departments}
                handleDepartmentChange={handleDepartmentChange}
                handleConnectionChange={handleConnectionChange}
            />
            <VariableSizeList
                className='brigade-list'
                height={window.innerHeight - 100} //100px это высота фильтров с отступами
                itemCount={Math.ceil(filteredBrigades.length / itemsPerRow)}
                itemSize={getItemSize}
                width={window.innerWidth}
            >
                {renderRow}
            </VariableSizeList >
        </>
    );
};

export default BrigadeList;
