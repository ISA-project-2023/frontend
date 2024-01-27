import { Equipment } from '../model/equipment.model';
import { EquipmentAmount } from './equipment-amount.model';

export interface Company{
    id: number;
    name: string;
    location: string;
    grade: number;
    startTime: string;
    endTime: string;
    equipment: Equipment[];
    equipmentAmountInStock: EquipmentAmount[];
}