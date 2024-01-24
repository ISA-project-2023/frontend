import { Customer } from "src/features/users/model/customer.model";
import { PickUpAppointment } from "./pickup-appointment.model";
import { Equipment } from "./equipment.model";
import { Company } from "./company.model";

export interface Reservation{
    id: number;
    pickUpAppointment: PickUpAppointment;
    customer: Customer;
    equipment: Equipment[];
    company: Company;
    status: string;
}