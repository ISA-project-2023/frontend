import { Company } from "src/features/companies/model/company.model";
import { User } from "src/features/users/model/user.model";
export interface CompanyAdmin{
    id: number;
    user?: User;
    jobDescription: string;
    company: Company;
}