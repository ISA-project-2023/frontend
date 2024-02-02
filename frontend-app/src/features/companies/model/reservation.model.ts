import { Customer } from "src/features/users/model/customer.model";
import { PickUpAppointment } from "./pickup-appointment.model";
import { EquipmentAmount } from "./equipment-amount.model";
import { Company } from "./company.model";

export interface Reservation{
    id: number;
    pickUpAppointment: PickUpAppointment;
    customer: Customer;
    equipment: EquipmentAmount[];
    company: Company;
    status: string;
}