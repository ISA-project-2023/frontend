import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { SystemAdmin } from 'src/features/users/model/system-admin.model';
import { User } from 'src/features/users/model/user.model';
import { UserService } from 'src/features/users/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Input() shouldEdit: boolean = false;

  loggedUser!: User;
  isSystemAdmin: boolean = false;
  isCustomer: boolean = false;
  isCompanyAdmin: boolean = false;
  
  constructor(private router: Router, private userService: UserService) {  }

  ngOnInit(): void {
    if (this.isLoggedIn()){
      this.getCurrentUser();
    }
  }

  toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
  
    if (sidebar) {
      sidebar.style.display = (sidebar.style.display === 'none' || sidebar.style.display === '') ? 'block' : 'none';
    } else {
      console.error('Sidebar element not found.');
    }
  }
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToCompanies() {
    this.router.navigate(['/companiesReview']);
  }

  navigateToCompanyRegistration() {
    this.router.navigate(['/companyRegistration']);
  }

  navigateToReservationAccept() {
    this.router.navigate(['/accept-reservations']);
  }

  navigateToMapSimulator(){
    this.router.navigate(['/map']);
  }

  navigateToEquipmentSearch() {
    this.router.navigate(['/searchEquipment']);
  }
  navigateToPickupHistory() {
    this.router.navigate(['/pickupHistory']);
  }
  navigateToMyProfile(){
    this.router.navigate(['/my-profile']);
  }
  navigateToQrCodes(){
    this.router.navigate(['/qrCodes']);
  }

  navigateToPenaltyPoints(){
    this.router.navigate(['/penalty-points']);
  }

  navigateToCompanyAdminProfile(){
    this.router.navigate(['/company-admin-profile']);
  }
  navigateToContracts(){
    this.router.navigate(['/contracts']);
  }

  navigateToMyReservations(){
    this.router.navigate(['/my-reservations']);
  }

  navigateToSystemAdminProfile(){
    this.router.navigate(['/system-admin-profile'])
  }

  navigateToPickUpAppointments(){
    this.router.navigate(['/system-admin-profile'])
  }
  
  logout() {
    this.userService.logout().subscribe(
      (response) => {
        if(response === 'Logout successful'){
          this.router.navigate(['/home']);
        }
        else {
          console.error('Unexpected response:', response);
        }
      },
      (error) => {
        console.error('Logout error:', error);
      }
    );
    let user: User | undefined;
    this.userRole(user!);
  }

  register(){
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    return this.userService.isAuthenticated();
  }

  onLoginChanged():void{
    this.getCurrentUser();
  }

  getCurrentUser(): void{
    if (!this.isCompanyAdmin && !this.isSystemAdmin && !this.isCustomer) {
      this.userService.getCurrentUser().subscribe(
        (data) => {
          this.loggedUser = data;
          this.userRole(data);
          if(data.role === 'SYSTEM_ADMIN'){
            this.getSystemAdmin();
          }
          this.router.navigate(['/home']);
        },
        (error) => {
          this.userRole(this.loggedUser!);
          console.error('cant fetch current user');
        }
      );
    }
  }

  userRole(user: User){
    if (user === undefined){
      this.isSystemAdmin = false;
      this.isCustomer = false;
      this.isCompanyAdmin = false;
    }
    else {
      if (user.role === 'CUSTOMER'){
        this.isSystemAdmin = false;
        this.isCustomer = true;
        this.isCompanyAdmin = false;
      } else if (user.role === 'COMPANY_ADMIN'){
        this.isSystemAdmin = false;
        this.isCustomer = false;
        this.isCompanyAdmin = true;
      } else {
        this.isSystemAdmin = true;
        this.isCustomer = false;
        this.isCompanyAdmin = false;
      }
    }
  }
  getSystemAdmin(): void{
    this.userService.getCurrentSystemAdmin().subscribe(
      (admin: SystemAdmin) => {
        if(admin.isActivated === false){
          this.router.navigate(['change-password']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.log('Nije dobavljen ulogovani systemAdmin')
        console.log(error)
      }
    )
  }
}
