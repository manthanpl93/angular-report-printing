import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import * as jspdf from "jspdf";
import html2canvas from "html2canvas";

@NgModule({
  declarations: [
    AppComponent,
    CertificatesComponent,
    PdfViewerComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FontAwesomeModule,
    PdfViewerModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
