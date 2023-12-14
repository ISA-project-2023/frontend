import { Customer } from "./customer.model";
import { CompanyAdmin } from "./company-admin.model";

export interface CompanyAdminComplaint {
    id: number;
    companyAdmin: CompanyAdmin;
    text: string;
    customer: Customer;
    isAnswered: boolean;
}