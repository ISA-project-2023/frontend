import { Company } from "./company.model";
import { Equipment } from "./equipment.model";

export interface Contract{
    id: number;
    company: String;
    equipment: String;
    hospital: String;
    hospitalAddress: String;
    valid: boolean;
    date: Date;
    amount: number;
}