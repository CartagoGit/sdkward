import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    async loadComponent() {
      return (await import('./shared/palette/palette.component'))
        .PaletteComponent;
    },
  },
];
