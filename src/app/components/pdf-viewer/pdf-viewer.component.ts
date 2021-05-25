import { Component, OnInit, ViewChild, TemplateRef, Output, Input, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faDownload , faPrint} from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
  @ViewChild('pdfViewerModel') pdfViewerModel: TemplateRef<any>;
  @Output() closePdfViewer = new EventEmitter();
  @Input() pdfDataUri: string;
  faDownload = faDownload;
  faPrint = faPrint;
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    const modal = this.modalService.open(this.pdfViewerModel, { scrollable: true, size: 'xl' });
    modal.result.then(() => {
      //User closes
      this.closePdfViewer.emit();
    },
      () => {
        //Backdrop click
        this.closePdfViewer.emit();
      });
  }


  downloadPDF() {
    var a = document.createElement("a");
    a.href = this.pdfDataUri;
    a.setAttribute("download", "certificate.pdf");
    a.click();
  }

  printPDF(){
    //this.pdfDOC.autoPrint();
  }

}
