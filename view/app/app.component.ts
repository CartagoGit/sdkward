import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // public ipcRenderer = ipcRenderer;
  public ipcRenderer!: typeof ipcRenderer;
  public colors: number[] = [];

  public isExpanded: boolean = true;
  constructor() {
    for (let i = 0; i < 10; i++) {
      this.colors.push(i);
    }
  }

  ngOnInit(): void {
    // TODO hacerlo invocado desde el main y que cualquier evento lo pueda escuchar
    // TODO y sea tipado
    this.ipcRenderer = (window as any).require('electron')
      .ipcRenderer as typeof ipcRenderer;
    // Escucha el evento desde el proceso principal para reiniciar
    this.ipcRenderer.on('restart-renderer', () => {
      // Realiza la lógica de reinicio o actualización en Angular
      // Por ejemplo, puedes recargar la página
      console.log('Recargando la página...');
      window.location.reload();
    });
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.info('AppComponent:: ngOnInit()');
  }

  public sendToIpc(): void {
    console.log('Sending message to ipc...', this.ipcRenderer);
    this.ipcRenderer.send('restart-renderer', 'Hello from Angular!');
  }

  public toogleAside(): void {
    console.log('toogleAside', this.isExpanded);
    this.isExpanded = !this.isExpanded;
  }
}
