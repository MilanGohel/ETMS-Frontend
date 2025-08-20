import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  { path: 'project/:id', renderMode: RenderMode.Server },
  {
    path: "admin/manage-permissions",
    renderMode: RenderMode.Client
  }
];
