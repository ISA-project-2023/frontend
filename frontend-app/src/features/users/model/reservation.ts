import { Company } from "src/features/companies/model/company.model";
import { Customer } from "./customer.model";
import { PickUpAppointment } from "src/features/companies/model/pickup-appointment.model";

export interface Reservation{
    id: number;
    status: string;
    customer: Customer;
    company: Company;
    pickUpAppointment: PickUpAppointment;
}