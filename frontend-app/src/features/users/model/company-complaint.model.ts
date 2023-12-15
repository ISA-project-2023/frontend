import { Company } from "src/features/companies/model/company.model";
import { Customer } from "./customer.model";

export interface CompanyComplaint {
    id: number;
    company: Company;
    text: string;
    customer: Customer;
    isAnswered: boolean;
}