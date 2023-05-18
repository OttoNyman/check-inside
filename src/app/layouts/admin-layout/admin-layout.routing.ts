import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { CheckProductsComponent } from 'src/app/pages/check-products/check-products.component';
import { CheckCosmeticsComponent } from 'src/app/pages/check-cosmetics/check-cosmetics.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'check-cosmetics', component: CheckCosmeticsComponent },
    { path: 'check-vitamins', component: MapsComponent },
    { path: 'check-products', component: CheckProductsComponent },
    { path: 'check-other', component: MapsComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
];
