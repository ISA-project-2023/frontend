import { Equipment } from '../model/equipment.model';

export interface Company{
    id: number;
    name: string;
    location: string;
    grade: number;
    startTime: Date;
    endTime: Date;
    equipment: Equipment[];
}