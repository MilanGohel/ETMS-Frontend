import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    messageService = inject(MessageService);

    success(summary: string, detail:string){
      this.messageService.add({severity: 'success', summary, detail})
    }

    warn(summary: string, detail:string){
      this.messageService.add({severity: 'warn', summary, detail})
    }

    error(summary: string, detail:string){
      this.messageService.add({severity: 'error', summary, detail})
    }

    info(summary: string, detail:string){
      this.messageService.add({severity: 'info', summary, detail})
    }
}
