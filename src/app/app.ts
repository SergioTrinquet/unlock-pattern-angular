import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SelectComponent } from './features/select/select';
import { GridComponent } from './features/grid/grid';
import { DeleteSchemaComponent } from './features/delete-schema/delete-schema';
import { MessageComponent } from './features/message/message';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SelectComponent, GridComponent, DeleteSchemaComponent, MessageComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected selectedValue: number | null = null;
  
  onSelectValueChange(value: number | null) {
    this.selectedValue = value;
  }
}
