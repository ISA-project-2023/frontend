import { CompanyAdmin } from "src/features/users/model/company-admin.model";

export interface PickUpAppointment{
    id: number;
    date: Date;
    duration: number;
    free: boolean;
    companyAdmin: CompanyAdmin
}