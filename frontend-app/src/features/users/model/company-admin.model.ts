import { Company } from "src/features/companies/model/company.model";
import { User } from "src/features/users/model/user.model";
export interface CompanyAdmin{
    id: number;

    username: String;
    email: String;
    penaltyPoints: number;
    role: String;
    firstName: String;
    lastName: String;
    category: String;
    
    user?: User;

    jobDescription: string;
    company: Company;
}