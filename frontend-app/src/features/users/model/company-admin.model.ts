import { Company } from "src/features/companies/model/company.model";
export interface CompanyAdmin{
    id: number;
    username: String;
    email: String;
    penaltyPoints: number;
    role: String;
    firstName: String;
    lastName: String;
    category: String;

    jobDescription: string;
    company: Company;
}