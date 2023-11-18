import { Company } from "src/features/companies/model/company.model";
export interface CompanyAdmin{
    id: number;
    jobDescription: string;
    company: Company;
}