import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';


export type DataFile = {
  id?: number
  name: string
  file: string
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private readonly gxIndexedDBService: NgxIndexedDBService) { }

  private readonly TABLE = 'files'


  submitData(name: string, data: string){
    //get value of form
    if (name === undefined || data === undefined) {
      throw new Error('Invalid parameters')
    }
    this.gxIndexedDBService.add(this.TABLE, {
      name: name,
      file: data,
    })
    .subscribe((key) => {
      console.log('key: ', key);
    });
  }

  getAll = async (): Promise<DataFile[]> => {
    const files = await this.gxIndexedDBService.getAll(this.TABLE).toPromise().then(
      files => {
          return (files as DataFile[])
      },
      error => {
          throw new Error(error)
      }
    );
    return files
  }

  delete = async (file: DataFile): Promise<void> =>  {
    if (file.id !== undefined) {
      console.log('delete: ', file.id)
      this.gxIndexedDBService.deleteByKey(this.TABLE, file.id)
        .toPromise()
        .then((res) => console.log(res))
        .catch(e => {
          throw new Error(e)
        })
    }
  }
}
