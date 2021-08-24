import { Component, OnInit } from '@angular/core';
import { EntityType } from 'src/app/models/entity-type';
import { DataFile, StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {

  af1Str =
  'AsMultiploDe2'
  + '\n' + '2'
  + '\n' + 'q0'
  + '\n' + 'q0'
  + '\n' + 'a'
  + '\n' + 'q0,a,q1'
  + '\n' + 'q1,a,q0'

  af2Str =
  'ImparDeBs'
  + '\n' + '2'
  + '\n' + 'q0'
  + '\n' + 'q1'
  + '\n' + 'b'
  + '\n' + 'q0,b,q1'
  + '\n' + 'q1,b,q0'

  files: DataFile[] = []

  constructor(private readonly storageService: StorageService) { }

  async ngOnInit(): Promise<void> {
    await this.refresh()
    if (this.files.length <= 0) {
      this.storageService.submitData(this.af1Str.split('\n')[0], this.af1Str, EntityType.Af)
      this.storageService.submitData(this.af2Str.split('\n')[0], this.af2Str, EntityType.Af)
      await this.refresh()
    }
  }

  remove = (index: number) => {
    this.files.splice(index, 1)
  }

  refresh = async (): Promise<void> => {
    this.files = await this.storageService.getAll()
    console.log(this.files)
  }

  delete = async (file: DataFile): Promise<void> => {
    await this.storageService.delete(file)
    this.refresh()
  }
}
