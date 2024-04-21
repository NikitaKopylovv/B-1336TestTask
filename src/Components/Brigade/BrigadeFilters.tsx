import { Flex, Select } from "antd";
import { ConnectionState } from "../../Store/ConnectionStatusSlice";
import { Department } from "../../Store/DepartmentsSlice";
import '../../styles/Brigade/BrigadeList.css';

interface BrigadeFiltersProps {
    connectionStates: ConnectionState[];
    departments: Department[];
    handleDepartmentChange: (value: number | undefined) => void;
    handleConnectionChange: (value: number | undefined) => void;
}

const BrigadeFilters: React.FC<BrigadeFiltersProps> = ({ connectionStates, departments, handleDepartmentChange, handleConnectionChange }) => {
    return (
        <Flex className='filter-flex-container' gap="middle">
            <Select size="middle" className="filter-select" placeholder="Соединение" allowClear onChange={handleConnectionChange}>
                {connectionStates.map(state => (<Select.Option key={state.connectionStateId} value={state.connectionStateId}>{state.name}</Select.Option>))}
            </Select>
            <Select placeholder="Департамент" allowClear onChange={handleDepartmentChange}>
                {departments.map(department => (<Select.Option key={department?.id} value={department.id}>{department.name}</Select.Option>))}
            </Select>
        </Flex>
    );
}

export default BrigadeFilters;