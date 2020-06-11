import { Component} from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {

  files: any = [];
  selectedFile = null;
  progress: number = 0;

  constructor(private http: HttpClient) {}

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name);
      this.selectedFile = event[index];
      console.log('FILE DATA:', this.selectedFile);
      this.onUpload();
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1);
  }

  onUpload() {
    const fd = new FormData();
    fd.append('text/', this.selectedFile, this.selectedFile.name);
    this.http.post('http://3.220.167.233:9999/contentListener', fd, {
       reportProgress: true,
       observe: 'events'
    }).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          console.log(event);
          setTimeout(() => {
            this.progress = 0;
          }, 8500);

      }
    }
  )};
}
