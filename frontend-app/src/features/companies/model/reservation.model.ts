import { Customer } from "src/features/users/model/customer.model";
import { PickUpAppointment } from "./pickup-appointment.model";

export interface Reservation{
    id: number;
    pickUpAppointment: PickUpAppointment;
    customer: Customer;
    status: String;
}