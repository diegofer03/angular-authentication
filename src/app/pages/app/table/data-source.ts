import {BehaviorSubject, Observable} from 'rxjs';
import { PeriodicElement } from './table.component';
import { DataSource } from '@angular/cdk/collections';

export class ElementsDataSource extends DataSource<PeriodicElement> {
  /** Stream of data that is provided to the table. */
  data = new BehaviorSubject<PeriodicElement[]>([]);
  dataOriginal : PeriodicElement[] = []

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<PeriodicElement[]> {
    return this.data;
  }

  init(elements: PeriodicElement[]){
    this.data.next(elements)
    this.dataOriginal = elements
  }

  getTotal(){
    const elements = this.data.getValue()
    return elements.map(item => item.weight).reduce((weight, total) => weight + total, 0)
  }

  update(id : PeriodicElement['position'], changes: Partial<PeriodicElement>){
    const elements = this.data.getValue()
    const index = elements.findIndex(item => item.position === id)
    if (index != -1){
      elements[index] = {
        ...elements[index],
        ...changes
      }
    }
    this.data.next(elements)
  }

  find(query: string){
    const filterElements = this.dataOriginal.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.symbol.toLowerCase().includes(query.toLowerCase()))
    this.data.next(filterElements)
  }

  disconnect() {}
}
