import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { EntityType } from '../models/entity-type';


export type DataFile = {
  id?: number
  type: EntityType
  name: string
  file: string
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private readonly gxIndexedDBService: NgxIndexedDBService) { }

  private readonly TABLE = 'files'


  submitData(name: string, data: string, entityType: EntityType){
    if (name === undefined || data === undefined || entityType === undefined) {
      throw new Error('Invalid parameters')
    }
    this.gxIndexedDBService.add(this.TABLE, {
      name: name,
      type: entityType,
      file: data,
    })
    .subscribe((key) => {
      console.log('key: ', key);
    });
  }

  getAll = async (): Promise<DataFile[]> => {
    const files = await this.gxIndexedDBService.getAll(this.TABLE).toPromise().then(
      files => (files as DataFile[]),
      error => { throw new Error(error) }
    );
    return files
  }

  delete = async (file: DataFile): Promise<void> =>  {
    if (file.id !== undefined) {
      this.gxIndexedDBService.deleteByKey(this.TABLE, file.id)
        .toPromise()
        .then((res) => console.log(res))
        .catch(e => {
          throw new Error(e)
        })
    }
  }
}
